.PHONY: help install dev build test lint format clean docker-up docker-down docker-logs migrate seed

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Install all dependencies
	npm install

dev: ## Start development servers
	docker-compose up -d
	npm run dev

build: ## Build all packages
	npm run build

test: ## Run tests
	npm run test

lint: ## Run linter
	npm run lint

format: ## Format code
	npm run format

clean: ## Clean all build artifacts and dependencies
	npm run clean
	docker-compose down -v

docker-up: ## Start Docker services (PostgreSQL, Redis)
	docker-compose up -d

docker-down: ## Stop Docker services
	docker-compose down

docker-logs: ## View Docker logs
	docker-compose logs -f

migrate: ## Run database migrations
	npm run migrate

seed: ## Seed database with sample data
	npm run seed

db-reset: ## Reset database (drop and recreate)
	docker-compose down -v postgres
	docker-compose up -d postgres
	sleep 5
	npm run migrate
	npm run seed
