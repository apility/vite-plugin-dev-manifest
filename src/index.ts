import { ConfigEnv, Plugin } from 'vite'
import { AddressInfo } from 'net'
import { resolve } from 'path'
import { writeFileSync } from 'fs'

export const devManifest = (): Plugin => {
  let env: ConfigEnv

  return {
    name: 'vite-plugin-dev-manifest',

    config: (_, configEnv) => {
      env = configEnv
    },

    configureServer (server) {
      const { command } = env
      if (command === 'serve') {
        server.httpServer!.once('listening', () => {
          const { port } = server.httpServer!.address() as AddressInfo
          const protocol = server.config.server.https ? 'https' : 'http'
          const host = server.config.server.host ?? 'localhost'

          const url = `${protocol}://${host}:${port}`

          const manifestPath = resolve(server.config.build.outDir, server.config.build.assetsDir, 'manifest.json')

          const manifest = { command, url }

          writeFileSync(manifestPath, JSON.stringify(manifest, null, 4))
        })
      }
    },
  }
}
