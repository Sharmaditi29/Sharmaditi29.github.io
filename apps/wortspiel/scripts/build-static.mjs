import { cp, mkdir, rm, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawn } from 'node:child_process'

const currentDir = path.dirname(fileURLToPath(import.meta.url))
const appRoot = path.resolve(currentDir, '..')
const outputRoot = path.resolve(appRoot, '../../static/Experiments/wortspiel')
const assetsRoot = path.join(outputRoot, 'assets')
const publicRoot = path.join(appRoot, 'public')
const buildId = `${Date.now()}`

const esbuildBinaryCandidates = [
  path.join(
    appRoot,
    'node_modules/.pnpm/@esbuild+darwin-arm64@0.18.20/node_modules/@esbuild/darwin-arm64/bin/esbuild',
  ),
  path.join(
    appRoot,
    'node_modules/.pnpm/@esbuild+darwin-arm64@0.21.5/node_modules/@esbuild/darwin-arm64/bin/esbuild',
  ),
]

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@500;600;700;800&family=Nunito:wght@400;500;600;700;800&display=swap"
      rel="stylesheet"
    />
    <script src="https://cdn.tailwindcss.com?plugins=forms,typography"></script>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              cream: '#fff1dc',
              paper: '#fffafc',
              ink: '#24324a',
              notebook: '#6a7294',
              sun: '#ffcd5c',
              apricot: '#ff9e68',
              blush: '#ff5d8f',
              leaf: '#57b971',
              sky: '#7ab6ff',
              bubble: '#8d7cff',
              mint: '#90ead8',
              peach: '#ffd7b8',
              splash: '#5d5fef',
              line: '#f1d8ea'
            },
            boxShadow: {
              card: '0 22px 48px rgba(93, 95, 239, 0.12)',
              soft: '0 12px 28px rgba(255, 93, 143, 0.12)'
            },
            fontFamily: {
              display: ['"Bricolage Grotesque"', 'sans-serif'],
              body: ['"Nunito"', 'sans-serif']
            },
            backgroundImage: {
              rulebook:
                'linear-gradient(180deg, rgba(255,255,255,0.65), rgba(255,255,255,0.65)), repeating-linear-gradient(180deg, transparent 0, transparent 34px, rgba(234,219,197,0.65) 34px, rgba(234,219,197,0.65) 35px)'
            }
          }
        }
      }
    </script>
    <style>
      :root {
        color: #24324a;
        background: #fff6fb;
        font-family: 'Nunito', sans-serif;
        font-synthesis: none;
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      html {
        scroll-behavior: smooth;
      }

      body {
        margin: 0;
        min-width: 320px;
        background:
          radial-gradient(circle at 12% 12%, rgba(255, 205, 92, 0.14), transparent 24%),
          radial-gradient(circle at 88% 10%, rgba(141, 124, 255, 0.12), transparent 20%),
          radial-gradient(circle at 82% 80%, rgba(144, 234, 216, 0.12), transparent 22%),
          linear-gradient(180deg, #fff9f4 0%, #fff8fb 100%);
        color: #24324a;
      }

      #root {
        min-height: 100vh;
      }

      button,
      input,
      textarea,
      select {
        font: inherit;
      }
    </style>
    <script>
      window.__LINGOGARDEN_BUILD_ID__ = '${buildId}'
    </script>
    <title>LingoGarden - German Study Desk</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="./assets/app.js?v=${buildId}"></script>
  </body>
</html>
`

export async function buildStaticSite() {
  await rm(outputRoot, { recursive: true, force: true })
  await mkdir(assetsRoot, { recursive: true })
  await cp(publicRoot, outputRoot, { recursive: true, force: true })

  const esbuildBinary =
    esbuildBinaryCandidates.find((candidate) => existsSync(candidate)) ??
    path.join(appRoot, 'node_modules', '.bin', 'esbuild')

  await new Promise((resolve, reject) => {
    const buildProcess = spawn(
      esbuildBinary,
      [
        'src/static-entry.tsx',
        '--bundle',
        '--format=esm',
        '--target=es2020',
        '--jsx=automatic',
        `--outfile=${path.join(assetsRoot, 'app.js')}`,
        '--define:process.env.NODE_ENV="production"',
      ],
      {
        cwd: appRoot,
        stdio: 'inherit',
      },
    )

    buildProcess.on('error', reject)
    buildProcess.on('close', (code, signal) => {
      if (code === 0) {
        resolve(undefined)
        return
      }

      reject(new Error(`esbuild failed with code ${code ?? 'null'}${signal ? ` (signal ${signal})` : ''}`))
    })
  })

  await writeFile(path.join(outputRoot, 'index.html'), html, 'utf8')
}

const isDirectRun = process.argv[1] === fileURLToPath(import.meta.url)

if (isDirectRun) {
  await buildStaticSite()
}
