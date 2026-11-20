pipeline {
    agent any

    environment {
        COMPOSE_PROJECT_NAME = 'glosario-ci'
        BACKEND_IMAGE        = 'glosario-backend'
        FRONTEND_IMAGE       = 'glosario-frontend'
        JWT_SECRET           = 'secreto_solo_para_ci'
    }

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    stages {
        stage('Obtener código') {
            steps {
                // Jenkins descarga el repositorio configurado en el job (SCM)
                checkout scm
            }
        }

        stage('Pruebas del backend') {
            steps {
                // La etapa "test" del Dockerfile ejecuta npm test; si falla, falla el build
                sh 'docker build --target test -t ${BACKEND_IMAGE}:test backend'
            }
        }

        stage('Construir imágenes Docker') {
            steps {
                sh '''
                    docker build -t ${BACKEND_IMAGE}:${BUILD_NUMBER} -t ${BACKEND_IMAGE}:latest backend
                    docker build -t ${FRONTEND_IMAGE}:${BUILD_NUMBER} -t ${FRONTEND_IMAGE}:latest frontend
                '''
            }
        }

        stage('Ejecutar contenedores') {
            steps {
                sh 'docker compose up -d --build'
            }
        }

        stage('Verificar aplicación') {
            steps {
                sh '''
                    for i in $(seq 1 15); do
                        if docker run --rm --network ${COMPOSE_PROJECT_NAME}_glosario-net curlimages/curl:8.8.0 -fsS http://backend:5000/ ; then
                            backend_ok=1; break
                        fi
                        echo "Esperando al backend ($i/15)..."; sleep 4
                    done
                    [ "$backend_ok" = "1" ] || { echo "El backend no respondió"; exit 1; }

                    docker run --rm --network ${COMPOSE_PROJECT_NAME}_glosario-net curlimages/curl:8.8.0 -fsS -o /dev/null http://frontend/
                    echo "Backend y frontend respondieron correctamente"
                '''
            }
        }
    }

    post {
        always {
            sh 'docker compose logs --tail=30 || true'
            sh 'docker compose down -v || true'
        }
        success { echo 'Pipeline completado con éxito' }
        failure { echo 'El pipeline falló, revisa los logs de la etapa' }
    }
}
