#!groovy

pipeline {
    agent {
        label 'hamsterswap'
    }

    post {
        always {
            cleanWs()
            deleteDir()
        }

        cleanup {
            script {
                sh '''
                    docker rmi -f "${REGISTRY_NAME}:${CURRENT_VERSION}-${GIT_BRANCH}"
                    docker rmi -f "test-${REGISTRY_NAME}:${CURRENT_VERSION}-${GIT_BRANCH}"
                    docker system prune --volumes -f
                '''
            }
        }
    }

    environment {
        // app env
        // Add something here

        // build info env
        GIT_BRANCH = "${GIT_BRANCH.split("/")[1]}"
        CURRENT_VERSION = sh(returnStdout: true, script: "git tag --sort version:refname | tail -1").trim()

        // credential id
        REGISTRY_CREDENTIAL_ID = 'ecr:ap-southeast-1:aws-credentials'
        GITLAB_PUSH_SECRET = credentials('uid-gitlab-webhook-secret')
        REGISTRY_URL = credentials('registry-url-backend')

        // dokku deployment credential
        REGISTRY_NAME = 'a8-uid-backend'
        DOKKU_DEV_REMOTE = credentials('dokku-dev-remote-backend')
        DOKKU_PROD_REMOTE = credentials('dokku-prod-remote-backend')
        SSH_PRIVATE_KEY = credentials('uid-dokku-deployment-private-key')
    }

    stages {
        stage('setup-parameters') {
            steps {
                gitlabCommitStatus('setup-parameters') {
                    script {
                        properties([
                                disableConcurrentBuilds([
                                        abortPrevious: true
                                ]),
                                parameters([
                                        booleanParam(
                                                defaultValue: false,
                                                description: 'Trigger a dokku deployment.',
                                                name: 'DOKKU_DEPLOY'
                                        ),
                                        booleanParam(
                                                defaultValue: false,
                                                description: 'Trigger a dockerfile build and publish to ecr repository.',
                                                name: 'BUILD_AND_PUBLISH_IMAGE'
                                        ),
                                ])
                        ])
                    }
                }
            }
        }

        stage('build-info') {
            steps {
                gitlabCommitStatus('build-info') {
                    echo 'Current branch: ' + env.GIT_BRANCH
                    echo 'Current version: ' + env.CURRENT_VERSION
                }
            }
        }

        stage('test') {
            steps {
                gitlabCommitStatus('test') {
                    script {
                        def image = docker.build("test-${env.REGISTRY_NAME}:${env.CURRENT_VERSION}-${env.GIT_BRANCH}", "-f Dockerfile.test ./")
                        image.inside {
                            sh 'yarn install'
                            sh 'yarn test'
                            sh 'yarn test:e2e'
                        }
                    }
                }
            }
        }

        stage('publish-image') {
            when {
                expression {
                    params.BUILD_AND_PUBLISH_IMAGE == true && (env.GIT_BRANCH == 'develop' || env.GIT_BRANCH == 'main')
                }
            }
            steps {
                gitlabCommitStatus('publish-image') {
                    script {
                        docker.withRegistry(env.REGISTRY_URL, env.REGISTRY_CREDENTIAL_ID) {
                            def image = docker.build("${env.REGISTRY_NAME}:${env.CURRENT_VERSION}-${env.GIT_BRANCH}", "./")

                            // push the image to registry
                            image.push()
                        }
                    }
                }
            }
        }

        stage('deploy') {
            agent {
                docker {
                    image 'dokku/ci-docker-image'
                    args '-v $PWD:/app'
                    reuseNode true
                }
            }

            when {
                expression {
                    params.DOKKU_DEPLOY == true && (env.GIT_BRANCH == 'develop' || env.GIT_BRANCH == 'main')
                }
            }

            steps {
                gitlabCommitStatus('deploy') {
                    sh 'echo "Deploying to ${GIT_BRANCH} environment ..."'
                    sh 'rm -rf .husky/'

                    script {
                        if (env.GIT_BRANCH == 'develop') {
                            sh '''
                            set +x
                            GIT_REMOTE_URL=${DOKKU_DEV_REMOTE} SSH_PRIVATE_KEY=$(cat ${SSH_PRIVATE_KEY}) dokku-deploy
                            set -x
                            '''
                        }

                        if (env.GIT_BRANCH == 'main') {
                            sh '''
                            set +x
                            GIT_REMOTE_URL=${DOKKU_PROD_REMOTE} SSH_PRIVATE_KEY=$(cat ${SSH_PRIVATE_KEY}) dokku-deploy
                            set -x
                            '''
                        }
                    }
                }
            }
        }
    }
}