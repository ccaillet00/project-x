# Stresstest - Project-x

## Testsysteme 

| Tester | OS         | CPU              | RAM   | Speicher  |
|--------|------------|------------------|-------|-----------|
| Nikka  | Windows 11 Pro | Intel Core Ultra 7 255H | 32 GB | 1 TB HDD  |
| Leon   | Windows 10 | Intel Core i7-10700F | 32 GB | 1 TB SSD|
| Cédric | macOS Tahoe 26.3  | Apple M4 Pro  | 48 GB | 1 TB SSD |
| Adel   | Windows 11 | Intel Core i5 13600 KF | 32 GB | 2 TB M2 NVME

## 1. pgbench - Datenbanktest

### Testergebnisse

| Tester | pgbench Version | Transaction Type | Scaling Factor | Query Mode | Clients | Threads | Dauer | Transaktion verarbeitet | Fehlgeschlagene Transaktionen | Latency Average | Initial Connection Time | **TPS ohne Verbindungszeit** |
|--------|-----------------|------------------|----------------|------------|---------|--------|-------|-------------------------|-------------------------------|-----------------|--------------------------|------------------------------|
| Nikka  | 18.3 Debian     | TPC-B (built in) | 100            | simple     | 10      | 4       | 100 s | 140'302                 | 0 (0.000%)                    | 7.117 ms       | 148.030 ms               | **1'404.99**                 |
| Leon   | 18.1 Debian     | TPC-B (built in) | 100            | simple     | 10      | 4       | 100 s | 500'000                 | 0 (0.000%)                    | 14.583 ms      | 643.171 ms               | **3'656.75**                 |
| Cédric | 18.3 Debian     | TPC-B (built in) | 100            | simple     | 50      | 1       | -     | 500'000                 | 0 (0.000%)                    | 4.588 ms       | 64.433 ms                | **10'898.82**                |
| Adel   | 18.3 Debian     | TPC-B (built in) | 100            | simple     | 50      | 1       | -     | 500'000                 | 0 (0.000%)                    | 18.319 ms      | 1686.859 ms              | **2729.46**                  |     

## 2. k6 - HTTP Load- & Stresstests

### 2.1 Loadtest - ohne Cache

| Tester | Gesamtdauer | Requests gesamt | Requests/s | **Fehlerrate** | Avg. Latenz | Median Latenz | p(90) Latenz | p(95) Latenz | p(99) Latenz | Max. Latenz | Daten empfangen | Daten gesendet |
|--------|-------------|-----------------|------------|----------------|-------------|---------------|--------------|--------------|--------------|-------------|-----------------|----------------|
| Nikka  | 2m 38.1s    | 100'000         | 632.37 /s  | **15.30%**     | 15.67 ms    | 13.05 ms      | 46.06 ms     | 50.56 ms     | 57.01 ms     | 183.06 ms   | 27 MB           | 7.7 MB         |
| Leon   | 2m 04.9s    | 100'000         | 800.34     | **0.00%**      | 12.41 ms    | 3.99 ms       | 30.21 ms     | 33.22 ms     | 40.00 ms     | 133.38 ms   | 39 MB           | 7.7 MB         |
| Cédric | 0m 35.4s    | 100'000         | 2'826.18   | **0.00%**      | 3.49 ms     | 4.07 ms       | 5.27 ms      | 5.71 ms      | 6.90 ms      | 62.63 ms    | 118 MB          | 7.4 MB         |
| Adel   | 0m 51.3s    | 100'000         | 1'948.54   | **43.53%**     | 5.06 ms     | 1.18 ms       | 16.24 ms     | 17.66 ms     | 21.78 ms     | 116.60 ms   | 29 MB           | 7.7 MB         |

### 2.2 Loadtest - mit Cache 

| Tester | Gesamtdauer | Requests gesamt | Requests/s | **Fehlerrate** | Avg. Latenz | Median Latenz | p(90) Latenz | p(95) Latenz | p(99) Latenz | Max. Latenz | Daten empfangen | Daten gesendet |
|--------|-------------|-----------------|------------|----------------|-------------|---------------|--------------|--------------|--------------|-------------|-----------------|----------------|
| Nikka  | 1m 51.1s    | 100'000         | 899.94 /s  | **0.00%**      | 10.93 ms    | 4.21 ms       | 24.57 ms     | 27.27 ms     | 34.74 ms     | 262.95 ms   | 27 MB           | 7.7 MB         |
| Leon   | 2m 03.1s    | 100'000         | 812.39     | **0.00%**      | 12.23 ms    | 2.58 ms       | 29.84 ms     | 33.21 ms     | 41.89 ms     | 72.45 ms    | 39 MB           | 7.4 MB         |
| Cédric | 0m 34.2s    | 100'000         | 2'926.68   | **0.00%**      | 3.37 ms     | 4.03 ms       | 5.13 ms      | 5.61 ms      | 6.90 ms      | 18.24 ms    | 118 MB          | 7.4 MB         |    
| Adel   |  0m 46.5s   | 100'000         | 2'150.90   | **43.53%**     | 4.58 ms     | 1.04 ms       | 14.96 ms     | 16.58 ms     | 20.77 ms     | 39.84 ms    | 29 MB           | 7.7 MB         |

### 2.3 Stresstest - ohne Cache

| Tester | Gesamtdauer | Requests gesamt | Requests/s | **Fehlerrate** | Avg. Latenz | Median Latenz | p(90) Latenz | p(95) Latenz | p(99) Latenz | Max. Latenz | Daten empfangen | Daten gesendet |
|--------|-------------|-----------------|------------|----------------|-------------|---------------|--------------|--------------|--------------|-------------|-----------------|----------------|
| Nikka  | 0m 29.9s    | 28'732          | 962.36 /s  | **1.74%**      | 11.54 ms    | 8.00  ms      | 23.50 ms     | 26.82 ms     | -            | 162.87 ms   | 7.7 MB          | 2.2 MB         |
| Leon   | 2m 17.9s    | 133'301         | 966.60     | **0.00%**      | 160.54 ms   | 54.81 ms      | 570.04 ms    | 761.13 ms    | 1.00 s       | 8.69 s      | 52 MB           | 10 MB          |
| Cédric | 3m 12.1s    | 505'798         | 2'634.51   | **1.41%**      | 122.96 ms   | 69.96 ms      | 246.08 ms    |  251.69 ms   | 263.78 ms    | 20.93 s     | 590 MB          | 40 MB          |
| Adel   | 0m 52.0s    | 98'907          | 1'903.89   | **42.91%**     | 11.37 ms    | 1.22 ms       | 42.52 ms     | 54.48 ms     | 71.94 ms     | 129.85 ms   | 28 MB           | 7.6 MB         |

### 2.4 Stresstest - mit Cache

| Tester | Gesamtdauer | Requests gesamt | Requests/s | **Fehlerrate** | Avg. Latenz | Median Latenz | p(90) Latenz | p(95) Latenz | p(99) Latenz | Max. Latenz | Daten empfangen | Daten gesendet |
|--------|-------------|-----------------|------------|----------------|-------------|---------------|--------------|--------------|--------------|-------------|-----------------|----------------|
| Nikka  | 1m 13.9s    | 86'569          | 1'171.65   | **6.97%**      | 33.87 ms    | 11.41 ms      | 109.24 ms    | 159.33 ms    | 211.72 ms    | 387.12 ms   | 23 MB           | 7.7 MB         |
| Leon   | 2m 22.0s    | 134'584         | 948.34     | **0.00%**      | 176.81 ms   | 56.71 ms      | 654.08 ms    | 810.09 ms    | 1.06 s       | 8.43 s      | 52 MB           | 10 MB          |
| Cédric | 4m 23.9s    | 666'586         | 2'525.77   | **0.46%**      | 209.67 ms   | 101.31 ms     | 238.56 ms    | 242.90 ms    | 257.65 ms    | 1m 0s       | 786 MB          | 50 MB          |
| Adel   | 0m 52.0s    | 131'133         | 2'524.11   | **56.94%**     | 8.57 ms     | 1.07 ms       | 33.36 ms     | 49.54 ms     | 68.93 ms     | 152.04 ms   | 39 MB           | 10 MB          |