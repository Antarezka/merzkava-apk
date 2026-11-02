# Shared application services

This directory contains infrastructure intentionally shared by multiple app modes. Keep mode-specific business rules and save schemas inside their owning system. The database connection/cache layer currently lives here; separate Convo and Offline Game persistence namespaces must remain explicit.
