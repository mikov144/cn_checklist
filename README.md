# Project Name

## Description

This project is a web application with a backend server written in Django REST framework and a frontend written in React using Vite.

## Project Structure

```
project-root/
├── backend/
│   ├── manage.py
│   ├── ...
├── frontend/
│   ├── src/
│   ├── ...
├── .gitignore
└── README.md
```

## Backend Setup (Django REST)

1. Navigate to the `backend` folder:
   ```sh
   cd backend
   ```

2. Create a virtual environment:
   ```sh
   python -m venv env
   ```

3. Activate the virtual environment:
   - On Windows:
     ```sh
     .\env\Scripts\activate
     ```
   - On macOS/Linux:
     ```sh
     source env/bin/activate
     ```

4. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```

5. Apply migrations:
   ```sh
   python manage.py migrate
   ```

6. Run the development server:
   ```sh
   python manage.py runserver
   ```

## Frontend Setup (React Vite)

1. Navigate to the `frontend` folder:
   ```sh
   cd frontend
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Run the development server:
   ```sh
   npm run dev
   ```

## Contributing

To contribute to this project, please fork the repository, create a new branch, and submit a pull request.

## License

This project is licensed under the MIT License.