# Nadi Pariksha Backend Setup

## MySQL Workbench Setup

1. **Create Database:**
```sql
CREATE DATABASE nadi_pariksha;
USE nadi_pariksha;
```

2. **Run the table creation queries** (from previous message)

3. **Update .env file** with your MySQL credentials:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=nadi_pariksha
DB_PORT=3306
PORT=3001
```

## Start Backend Server

```bash
cd backend
npm install
npm run dev
```

## Test Connection

The server will connect to your local MySQL Workbench and store all user data automatically when users sign up or login.