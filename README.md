## MGPlayz' Bot
* A discord.js bot made by MGPlayzYT. Features a meme command, voice commands, and more!
* [AGPL 3 License](https://raw.githubusercontent.com/MGPlayzYT/mgplayz-bot/main/LICENSE)

## Releases
* (Current) v1.0.0

## Hosting
(read the LICENSE file before proceeding)
* Requirements:
  * Node v12 and above (required for voice support)
  * pnpm version 5 (most-efficient) [or npm version 7 if you want]
  * git
  * nano
  * Atleast 90MB of free memory
  * Atleast 640MB of free disk space
  
* Step 1: Clone the repository
```
git clone https://github.com/MGPlayzYT/mgplayz-bot <custom folder name>
```
* Step 2: 
```
cd <your-custom-folder-name>
```
* Step 3:
```
mv .env.example .env
mv config.js.example config.js
```
* Step 4: Change the contents of your .env file
```
BOT_TOKEN=<put your bot token here>
```
* Step 5: 
```
nano .env
```
* Step 6: Start the installation process
   - pnpm:
   ```
   pnpm install package.json
   ```
   - npm:
   ```
   npm install package.json
   ```

* Step 7: Start the bot
```
node index.js
```
and you're done!
