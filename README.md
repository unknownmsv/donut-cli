# 🍩 Donut-CLI  

**The Sweetest CLI to Satisfy Your Project Cravings**  
*A sprinkle of magic to clone, build, and manage projects—fresh out of the oven!*  

---  

## 🚀 Quick Bite  

### Installation  
```bash  
git clone https://github.com/unknownmsv/donut-cli
cd donut-cli
npm install build
npm install
npm install -g .  
```  
*Pro tip: Tastes best with a side of `node.js`!*  

### First Bite  
```bash  
donut clone <project_name> -u <GitHub_user_name>  
```  
*Warning: May cause instant joy.*  

---  

## 🍴 Feature Buffet  

### 🔗 Smart Cloning (No Fork Required)  
```bash  
donut clone <project_name> -u <username>  
```  
- **Freshly baked** GitHub cloning (public/private repos).  
- Automatically adds *sprinkles* (configs) if detected.  

### 🏗️ Project Baker (Coming Soon!)  
```bash  
donut build  
```  
*Currently rising in the oven—patience, pastry padawan!*  

---  

## 📜 The Secret Recipe (`donut.ts`)  

Whip up a `donut.ts` to customize your project dough:  

```typescript  
use <lang> from <version>  // 🧂 Pinch of language  

function config() {  
  const PORT = <user_app_port>  // 🔌 Plug in your port  
  const LOCAL_URL = "0.0.0.0"   // 🌐 Local flavor  
  const serve = <server_file>   // 🍽️ Serve it hot!  
}  

function library() {  
  let libs: string[] = [<library>]  // 📚 Spice rack  
}  

app.start {  
  const config = config()  // 🥣 Mix settings  
  const librarys = library()  // 🧁 Fold in dependencies  
}  
```  
*Batter not included.*  

---  

## 📜 License  
```text  
Apache License 2.0 (Now with 100% more freedom frosting!)  
```  

---  

## 🧑‍🍳 Meet the Baker  
- 👨‍💻 **Head Chef**: `unknownmsv`  
- 🌐 **Secret Kitchen**: [donutmsv.ir](https://donutmsv.ir)  
- 💌 **Special Ingredient**: *JavaScript love*  

---  

> “Code is like a donut—best shared with friends. **Go forth and glaze the world!**” 🍩✨  

---  

### 🎉 **Extra Sprinkles**  
- **Need help?** Run `donut --help` for a sugar rush of options.  
- **Found a bug?** It’s a *feature crumb*—report it!  

*Happy coding, sweet dev!*