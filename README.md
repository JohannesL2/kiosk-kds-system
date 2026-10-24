# Kiosk & Kitchen Display System (KDS)

<img width="400" alt="demo-picture" src="https://github.com/user-attachments/assets/ab8afa77-b5f9-4853-aeff-34f3783b940e" />

<img width="364" alt="kds-system-flow" src="https://github.com/user-attachments/assets/9a722490-0142-4655-a80b-899fe554857c" />


A real-time order management system built with React, Vite, Node.js, Express, Socket.IO, and PostgreSQL.

Orders submitted from the kiosk are stored in PostgreSQL before being sent to the kitchen. The kitchen view loads saved orders when opened, and marking an order as **Done** updates its status in the database.

## Requirements

- Docker Desktop with Docker Compose
- Git

## Quick start

Start the app and database from the project directory:

```bash
docker compose up --build
```

On the first run, create the orders table:

```bash
docker compose exec db psql -U kiosk -d kiosk -c "CREATE TABLE IF NOT EXISTS orders (id BIGINT PRIMARY KEY, items JSONB NOT NULL, status TEXT NOT NULL DEFAULT 'new');"
```

If you already have an `orders` table without a `status` column, run this migration once:

```bash
docker compose exec db psql -U kiosk -d kiosk -c "ALTER TABLE orders ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'new';"
```

Open the app:

- **Kiosk:** [http://localhost:5173](http://localhost:5173)
- **Kitchen display:** [http://localhost:5173/kitchen](http://localhost:5173/kitchen)
- **Orders API:** [http://localhost:4000/orders](http://localhost:4000/orders)

Press `Ctrl+C` to stop the foreground Compose process, or run:

```bash
docker compose down
```

Order data is stored in a Docker volume and remains available after stopping and restarting the containers. To remove the containers **and permanently delete the database volume and its data**, run:

```bash
docker compose down -v
```

## Order flow

1. A customer adds menu items and submits an order from the kiosk.
2. The backend saves the order with a `new` status in PostgreSQL.
3. After saving, the backend broadcasts the order to connected kitchen displays using Socket.IO.
4. The kitchen view loads orders from the API when opened.
5. When staff mark an order as **Done**, its status is updated to `completed` in PostgreSQL and it is removed from the active kitchen view.

## Tech stack

- **Frontend:** React, Vite
- **Backend:** Node.js, Express
- **Communication:** Socket.IO
- **Database:** PostgreSQL
- **Local Development:** Docker Compose
