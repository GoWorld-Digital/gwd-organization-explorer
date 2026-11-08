# Deployment and domain plan

## Proposed public address
https://explore.goworld.digital

The Explorer is a GWD-owned public product experience. It should not be hosted under AtlasHub.SI because it communicates GWD's own organizational model and capability ecosystem.

## Domain separation
- goworld.digital — primary GWD institutional/community presence.
- explore.goworld.digital — public AI-Native Organization Explorer.
- ops.goworld.digital — possible future authenticated operating console; out of scope now.
- lab.goworld.digital — possible future private experimentation environment; out of scope now.

## Hosting
Recommended: dedicated Vercel project linked to this repository. Use preview deployments for PRs. Do not attach production domain to preview branches.

## Deployment stages
1. Local development.
2. Preview deployment per pull request.
3. Human owner review.
4. Production deployment.
5. Domain attachment and DNS verification.

Do not create/configure production Vercel, DNS, secrets or launch publicly without explicit approval from the GWD human owner.

## Security and rollback
The first release is static-first, public and requires no secrets or privileged server integrations. Any analytics must be privacy-conscious and approved. Keep the prior production deployment available for rollback.
