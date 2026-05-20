# NCubeLab Image Assessment Demo

Small Node.js + TailwindCSS website for testing AWS container image assessment workflows.

The app serves a single page that says:

```text
Welcome to NCubeLab!
```

The `.env` file intentionally contains fake secret-like values, and the `Dockerfile` intentionally copies `.env` into the image so scanners can inspect it.

## Run Locally

```bash
npm install
npm run build
npm start
```

Open `http://localhost:3000`.

## Build Docker Image

```bash
docker build -t alice-test-web-nodejs:latest .
docker run --rm -p 3000:3000 alice-test-web-nodejs:latest
```

## Push To ECR

```bash
AWS_REGION=ap-northeast-2
AWS_ACCOUNT_ID=729017845242
ECR_REPOSITORY=alice/iar-test
IMAGE_TAG=alice-test-web-nodejs-v$(date +%Y%m%d%H%M%S)

aws ecr get-login-password --region "$AWS_REGION" \
  | docker login --username AWS --password-stdin "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com"

docker tag alice-test-web-nodejs:latest \
  "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY:$IMAGE_TAG"

docker push "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY:$IMAGE_TAG"
```

## GitHub Actions

The workflow at `.github/workflows/build-and-push-ecr.yml` builds this Docker image and pushes it to:

```text
729017845242.dkr.ecr.ap-northeast-2.amazonaws.com/alice/iar-test:alice-test-web-nodejs-v<run_number>.<run_attempt>
```

It runs on pushes to `main` and can also be started manually with `workflow_dispatch`.
The workflow uses a fresh versioned tag on every run so immutable ECR tags are not overwritten.

Use one of these GitHub Secrets authentication setups:

```text
AWS_ROLE_TO_ASSUME
```

or:

```text
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
```

If your IAM role uses a narrow custom ECR policy, allow this repository ARN:

```text
arn:aws:ecr:ap-northeast-2:729017845242:repository/alice/iar-test
```
