
# WebMaster - Convert Website to Mobile App with Admin Dashboard

Welcome to **WebMaster**, a project designed to transform websites into mobile applications with an integrated admin panel for managing your content. Below are the setup and customization instructions for both the **Mobile App** and the **Admin Panel**.  

For more detailed instructions, we recommend that you follow this documentation: [WebMaster Documentation](https://codecrazetech.github.io/webmaster/docs/intro).
---

## Admin Panel

### Instructions

1. Open the project in **VSCode** or your preferred IDE.

---

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd .\dashboard\
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```


---
### Frontend Customization

1. Update the API domain:  
   Navigate to `dashboard -> src -> utils -> axios.jsx` and set your local development URL for `API_DOMAIN`.


---

### Backend Setup


1. Open the backend directory in your IDE:
   ```bash
   cd .\server\
   ```

2. Create a virtual environment and activate it:
   - **Windows**:
     ```bash
     python -m venv venv
     venv\Scripts\activate
     ```
   - **Linux**:
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Apply database migrations:
   - **Windows**:
     ```bash
     python manage.py migrate
     ```
   - **Linux**:
     ```bash
     python3 manage.py migrate
     ```

5. Create a superuser for accessing the admin dashboard:
   - **Windows**:
     ```bash
     python manage.py createsuperuser
     ```
   - **Linux**:
     ```bash
     python3 manage.py createsuperuser
     ```

6. Run the development server:
   - **Windows**:
     ```bash
     python manage.py runserver
     ```
   - **Linux**:
     ```bash
     python3 manage.py runserver
     ```

---

### Backend Customization

1. **Firebase Integration**  
   - Download your Firebase JSON file and rename it to `service-account.json`.  
   - Replace the existing `service-account.json` in the `server` directory.  

2. **Update Environment Variables**  
   - Copy the `project_id` from `service-account.json`.  
   - Replace the `project_id` in `server -> .env`.
  
3. **Development Mode**  
   - Set `DEBUG=True` in the `.env` file for development purposes.
  
4. **Update Settings.py**  
   - Then add you front-end server domain into `CORS_ALLOWED_ORIGINS` and `CSRF_TRUSTED_ORIGINS`

5. **Self-Hosting**  
   - Replace the hostname in `.env` with your desired domain for production hosting.

---

Feel free to reach out with any questions or issues during setup! 🚀
