#!groovy

def buildBadge = addEmbeddableBadgeConfiguration(id: "hamsterpocket-backend-build", subject: "hamsterpocket-backend-build")

pipeline {
    agent {
        label 'hamsterbox'
    }

    post {
        always {
            script {
                if (getContext(hudson.FilePath)) {
                    cleanWs()
                    deleteDir()
                }
            }
        }

        cleanup {
            script {
                if (getContext(hudson.FilePath)) {
                    sh '''
                        docker rmi -f "${REGISTRY_NAME}:${CURRENT_VERSION:-null}-${GIT_BRANCH}"
                        docker rmi -f "test-${REGISTRY_NAME}:${CURRENT_VERSION:-null}-${GIT_BRANCH}"
                        docker system prune --volumes -f
                    '''
                }
            }
        }

        failure {
            script {
                buildBadge.setStatus("failed")
            }
        }

        success {
            script {
                buildBadge.setStatus("passing")
            }
        }
    }

    environment {
        // app env
        // Add something here

        // build info env
        GIT_BRANCH = "${GIT_BRANCH}" //""${GIT_BRANCH.split("/")[1]}"
        CURRENT_VERSION = sh(returnStdout: true, script: "git tag --sort version:refname | tail -1").trim()

        // Registry
        REGISTRY_NAME = 'hamsterpocket'

        // dokku deployment credential
        DOKKU_DEV_REMOTE = credentials('dokku-dev-remote')
        DOKKU_PROD_REMOTE = credentials('dokku-prod-remote')
        SSH_PRIVATE_KEY = credentials('dokku-deployment-private-key')
    }

    stages {
        stage('setup-parameters') {
            steps {
                script {
                    properties([disableConcurrentBuilds([abortPrevious: true]),
                                parameters([booleanParam(defaultValue: false,
                                        description: 'Trigger a dokku deployment.',
                                        name: 'DOKKU_DEPLOY')])])

                    buildBadge.setStatus("running")
                }
            }
        }

        stage('build-info') {
            steps {
                echo 'Current branch: ' + env.GIT_BRANCH
                echo 'Current version: ' + env.CURRENT_VERSION
            }
        }

//        stage('test') {
//            steps {
//                script {
//                    def image = docker.build("test-${env.REGISTRY_NAME}:${env.CURRENT_VERSION}-${env.GIT_BRANCH}", "-f Dockerfile.test ./")
//                    image.inside {
//                        sh 'yarn install'
//                        sh 'yarn test'
//                        sh 'yarn test:e2e'
//                    }
//                }
//            }
//        }

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
