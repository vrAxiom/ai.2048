# 2048 Game

This is a simple implementation of the 2048 game built using React and Vite.

## Project Description

This project is a web-based version of the popular 2048 puzzle game. Players combine numbered tiles to reach the 2048 tile. The score is calculated as the sum of all tiles on the board.

## Setup Instructions

1.  **Clone the repository:**

    ```bash
    git clone <repository_url>
    cd ai.2048
    ```
2.  **Install dependencies:**

    ```bash
    npm install
    ```

## Running the Application

### Development

To run the application in development mode:

```bash
npm run dev
```

This will start a development server, and you can view the application in your browser.

### Production Build

To create a production build:

```bash
npm run build
```

This will generate a `dist` directory containing the production-ready files.

## Running on a VM with Apache Server

To deploy this application on a VM with Apache server, follow these steps:

1.  **Build the project:**

    ```bash
    npm run build
    ```
2.  **Copy the `dist` directory to your VM:**
    Copy the contents of the `dist` directory to a location on your VM that is accessible by Apache. For example, `/var/www/html/2048`.
3.  **Configure Apache:**
    Create a new virtual host configuration file for your application. For example, `/etc/apache2/sites-available/2048.conf`.
    Add the following configuration:

    ```apache
    <VirtualHost *:80>
        ServerName your_domain_or_ip
        ServerAdmin webmaster@localhost
        DocumentRoot /var/www/html/2048

        <Directory /var/www/html/2048>
            AllowOverride All
            Require all granted
        </Directory>

        ErrorLog ${APACHE_LOG_DIR}/error.log
        CustomLog ${APACHE_LOG_DIR}/access.log combined
    </VirtualHost>
    ```

    Replace `your_domain_or_ip` with your VM's domain name or IP address.
4.  **Enable the virtual host:**

    ```bash
    sudo a2ensite 2048.conf
    ```
5.  **Restart Apache:**

    ```bash
    sudo systemctl restart apache2
    ```

Now, you should be able to access the application in your browser by navigating to your VM's domain name or IP address.

## Dependencies

-   [React](https://reactjs.org/)
-   [React DOM](https://reactjs.org/docs/react-dom.html)
-   [Vite](https://vitejs.dev/)
-   [use-sound](https://www.npmjs.com/package/use-sound)
