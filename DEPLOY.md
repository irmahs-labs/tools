# Deploying Tools

It runs on the irmahs.dev Hetzner server like the other irmahs-labs apps, at **https://tools.irmahs.dev**.

```
visitor ──HTTPS──▶ Caddy (irmahs-labs/proxy) ──proxy network──▶ tools:3000
                                                                 (this repo: Caddy serving dist/)
```

The site is static: the image builds it with Node, then a small Caddy serves `dist/` on port 3000. It publishes no ports; the shared proxy handles HTTPS.

## One-time setup

1. **Cloudflare DNS** (irmahs.dev → DNS → Records): add the subdomain, pointing at the same server as `irmahs.dev`. Copy the IPs from the existing `irmahs.dev` (or `pantry-spinner`) records.

   | Type   | Name                | Content           | Proxy status |
   | ------ | ------------------- | ----------------- | ------------ |
   | `A`    | `tools`             | the server's IPv4 | Proxied      |
   | `AAAA` | `tools`             | the server's IPv6 | Proxied      |

   Every irmahs.dev record is **Proxied** (orange cloud), which keeps the server's IP hidden. That needs **SSL/TLS → Overview → Full (strict)** for the zone: Caddy still gets and renews its own Let's Encrypt certificates, since Cloudflare forwards `/.well-known/acme-challenge/` to the server over HTTP. Never use Flexible: Caddy redirects HTTP to HTTPS, so every site would loop.

2. **Server folder**: the deploy runs `mkdir -p /srv/tools` itself, which works if the `deploy` user can write to `/srv`. If the first deploy stops with "Permission denied", create it once as the admin user:

   ```sh
   ssh -t ADMIN_USER@SERVER_IP 'sudo mkdir -p /srv/tools && sudo chown deploy:deploy /srv/tools'
   ```

   Use the server's IP: with the records proxied, `ssh irmahs.dev` goes to Cloudflare, which does not pass SSH through.

3. **Secrets**: `DEPLOY_SSH_KEY`, `DEPLOY_KNOWN_HOSTS` and `DEPLOY_HOST` are shared at organization level. If the organization secrets are limited to selected repositories, add this one (Organization settings → Secrets and variables → Actions).

4. **Route the hostname** in irmahs-labs/proxy: add this block to `caddy/Caddyfile` and merge.

   ```
   # Tools (irmahs-labs/tools): a static site, no sign-in.
   tools.irmahs.dev {
   	import common
   	handle {
   		reverse_proxy tools:3000
   	}
   }
   ```

5. **Merge to `main`** here. The Deploy workflow clones the repo into `/srv/tools`, builds the image and starts it on the `proxy` network.

## Every deploy after that

Push to `main`. The site is rebuilt and restarted; no other app is touched. Pages are sent with `Cache-Control: no-cache` and the fingerprinted `/assets/*` are cached for a year, so visitors get the new version straight away.

## Run the container locally

```sh
docker network create proxy 2>/dev/null || true
docker compose up --build
docker run --rm --network proxy curlimages/curl -s tools:3000/ | head
```
