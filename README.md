#For LLM Download using https://ollama.com/download and run following commands in terminal:
ollama pull mistral,
ollama run mistral.

#Python Backend first set-up python and run following commands in terminal:
pip install mysql-connector-python requests,
pip install flask flask-cors.


#Frontend setup node,npm and run following commands in project folder in terminal:
npx create-react-app talk-to-db-frontend,
cd talk-to-db-frontend,
npm install axios.

#To run locally:
python talk_to_db.py (directory should be your project directory not frontend),
npm start(if directory is talk-to-db-frontend else run cd talk-to-db-frontend).

Happy coding.
