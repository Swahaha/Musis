# Makefile for musis project

.PHONY: install install-dev clean test

# Install project dependencies
install:
	pip install --upgrade pip
	pip install -r requirements.txt
	pip install -e .

# Install development dependencies (optional: linting, formatting)
install-dev:
	pip install --upgrade pip
	pip install -r requirements.txt
	pip install -e .
	pip install black isort flake8

# Run tests
test:
	python tests/test_visualize_cvc.py

# Clean up cache and build files
clean:
	find . -type d -name "__pycache__" -exec rm -r {} +
	find . -type d -name "*.egg-info" -exec rm -r {} +
	rm -rf .pytest_cache
	rm -rf dist
	rm -rf build

# Format code
format:
	black src/ tests/
	isort src/ tests/

# Check linting
lint:
	flake8 src/ tests/

# train Unet
train:
	python src/musis/train.py

