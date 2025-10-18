<h1 align="center">🐜</h1>
This is a multiplayer simulation game focused on the evolution of ant species. The main goal is to selectively breed your ant species, ensuring its adaptation to the environment and dominance over other players' species.

The game mechanics are based on real-world principles of ant genetics, including the mechanisms of genomes, chromosomes, meiosis, gene dominance, and more. These mechanics allow players to influence the evolution of their ant species, consequently altering the stats(strength, combat resistance, lifespan, and others) of newly born individual ants. Not all genes are available to the species at the start of the game. Genes for the soldier caste, for instance, only have a chance to emerge if the species frequently engages in combat. A similar dependency applies to the gene that allows ants to build satellite nests. The game also simulates the life of colonies with different ant castes(queen, workers, soldiers, females, and males) and their behavior, which is controlled by pheromones. The environment is dynamic and changes with the four seasons, which affects resource availability and requires adaptation.

## Play the Game

The game runs directly in a web browser and is fully playable on both 🖥️ desktop and 📱 mobile devices.

🎮 **Play Now:** [https://evolutionofants.click](https://evolutionofants.click/)<br>
🎥 **Watch Gameplay:** [YouTube Video](https://www.youtube.com/watch?v=fMoLUvllM98)

## System Architecture and Data Flow

The diagram below illustrates the overall architecture and data flow within the application.

![Diagram](diagram.png)

## Architecture Description
This architecture is designed to ensure high performance and reliability under real-time simulation conditions, following the principles of Clean Architecture and process separation on the server and client.

### ⚙️ Server Architecture
On the server side, the code follows Clean Architecture and is divided into three logical layers that form two separate processes to ensure stability and scalability.

#### Game Core
The Application Layer and Domain Layer constitute the game core. They run in a separate process(Python Process 2 on the diagram).

* **Domain Layer:** Contains the pure, independent business logic(game entities' behavior, environment changes, genetics, etc.). This logic runs in an infinite loop, where each simulation iteration occurs once per second and every game entity performs its action.
* **Application Layer:** This is the outer layer of the game core. The Engine class lives here and manages the execution of incoming commands using data serialization and deserialization, and invoking services from the Domain Layer.

#### Outer Layer
* **Infrastructure Layer:** This is the outer layer responsible for communication with the external world and resource management. This is where HTTP requests and WebSocket connections are handled, along with database management, email sending, and communication with the game core via the EngineAdapter, which uses a Redis channel(pub/sub) for message exchange.

**Key Solution:** The placement of the game core(Domain + Application Layers) in a separate process(Python Process 2) prevents the web server's operations such as HTTP request processing or database queries from affecting the stability and performance of the Engine and the simulated game world.

### 💻 Client Architecture
On the client side, the code follows Clean Architecture principles and is divided into three logical layers.

_Note on dependencies: The diagram above shows data flow, not dependency direction. To maintain Clean Architecture, functionality from the Synchronization Layer is injected into the Domain Layer, ensuring its independence from external concerns._

* **View Layer:** Contains DOM elements and is responsible for rendering graphics(Pixi.js) and all visual components(HTML, CSS, JS).

* **Domain Layer:** The client-side domain model lives here. It stores the world state, contains the business logic of the client application and processes step packages(packages with state changes).

* **Synchronization Layer:** The layer responsible for communication with the server. It receives step packages and sends player commands to the server via WebSocket.

**Key Solution:** The Domain Layer and Synchronization Layer run in a separate thread(Web Worker). This is necessary to decouple model processing from rendering. While the domain layer updates the model, the browser's main thread remains free for smooth animation performance.

### 🧩 How It Works

Every time interval, the entire game world takes a step. With each step, certain game events occur. These events are collected, and from them, so-called "step packages" are formed for each player. Each step package contains information about common events(ant movements, season changes, nest building, etc.) and player-specific ones(the progress of eggs developing in the nest, player notifications, etc.). Then these packages are passed through Redis to the EngineAdapter(within Python Process 1 on the diagram) and then via WebSockets to the browser of each online player. On the client side, these packages are received by the Synchronization Layer(within Web Worker on the diagram). First, the package is applied to the client domain model. After that, a new view update package is formed, which contains information about animations and player-specific UI changes. For optimization, this view update package is formed based on the player's current view position on the map. Then, it is passed to the view layer, where animations are played and the state of the player's panel is updated.

But what is happening in the ant's head during this process? Any living entity has a body, mind, and thoughts. The mind controls the execution of thoughts, which in turn control the body. This is a Strategy pattern, where thoughts are the strategies. The mind selects the appropriate thoughts for the circumstances. For example, when an ant feels hungry, the mind queues the thought that it needs to eat. Another example is when an enemy is nearby and attacking, the mind cancels lower-priority thoughts and creates a thought about defending itself.

### Composition Roots: 
* [Game Engine](https://github.com/adevianin/bugs/blob/master/bugs/engine_start.py)
* [Engine Adapter](https://github.com/adevianin/bugs/blob/master/bugs/main/init.py)
* [Client Game App](https://github.com/adevianin/bugs/blob/master/bugs/client/gameApp/src/index.js)

## 🛠️ Tech Stack
* **Client side**: JavaScript, Pixi.js/WebGL, Web Worker, WebSocket, Webpack
* **Server side**: Python 3, Django 5, Redis(as IPC), Multiprocessing(Custom Game Engine), Google OAuth 2.0 & SMTP, Docker, Caddy 2, SQLite(since RAM limit on free VPS)

## 🚀 Performance Tests

* **Test with ~4K Ants:** [YouTube Video](https://www.youtube.com/watch?v=fsOqnIcIcdM)<br>
_Note: See video description on YouTube for test conclusions._
* **Test with ~8K Ants:** [YouTube Video](https://www.youtube.com/watch?v=vmhddQBWWTw)

## 💡 Development Showcase

* **Early Stages of Development:** [YouTube Video](https://www.youtube.com/watch?v=pUTJYvNdoUg)
