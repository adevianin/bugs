This is a multiplayer game about the evolution of ant species. The main goal is to breed your own species through selection, adapting it to the environment and enabling it to dominate the species of other players. The game mechanics are based on real-world principles of ant genetics, including mechanisms of genomes, chromosomes, meiosis, gene dominance, etc. This allows players to influence the evolution of their species by changing the characteristics of individual ants, such as strength, combat resistance, lifespan, and others. The game also simulates the life of colonies with different ant castes (queen, workers, soldiers, females, and males) and their behavior, which is controlled by pheromones. The environment is dynamic and changes with four seasons, which affects resource availability and requires constant adaptation.

Detailed information on genetics and gameplay is available in the in-game help.

* **Game Website:** [https://evolutionofants.click/](https://evolutionofants.click/)
* **Gameplay Video:** [YouTube Video](https://www.youtube.com/watch?v=fMoLUvllM98)

### **How It Works**

It runs directly in a web browser, and is fully playable on both desktop and mobile devices.

In the game, living entities have a body, mind, and thoughts. The mind controls the execution of thoughts, which in turn control the body. This is a Strategy pattern, where thoughts are the strategies. The mind selects the appropriate thoughts for the circumstances. For example, when an ant feels hungry, the mind queues up the thought that it needs to eat. Or when an enemy is nearby and attacking, the mind cancels less prioritized thoughts and creates a thought about defending itself.

Every time interval, the entire game world takes a step. Currently, one step takes one second to execute. With each step, certain game events occur. These events are collected, and from them, domain model change packages, called step packages, are formed for each player. Each step package contains information about common events (ant movements, season changes, nest building, etc.) and player-specific ones (the progress of eggs developing in the nest, player notifications, etc.). These packages are then passed through Redis to the process where Django is running. From there, these packages are sent via WebSockets to the browser of each online player. On the client side, these packages are received by a WebWorker. First, the changes from the package are applied to the client world model. After that, a new package is formed, which contains information about animations and player-specific changes. For optimization, this package is formed based on the player's current view position on the map. Then, the package is passed to the view layer. At this layer, animations are played using Pixi.js, and the state of the player's panel is updated. The diagram below illustrates the path of data through the system.

![Diagram](diagram.png)

### **Architecture Description**
This architecture is designed to ensure high performance and reliability under real-time simulation conditions, using the principles of Clean Architecture and process separation on the server and client.

#### Client Architecture
The client side is divided into three layers:

* **View Layer:** Contains DOM elements and is responsible for rendering graphics(Pixi.js) and all visual components(HTML, CSS, JavaScript).

* **Domain Layer:** The client-side domain model. It stores the world state and contains the business logic of the client application. It receives change packages(Step Packages) from the Synchronization Layer.

* **Synchronization Layer:** The layer responsible for communication with the server. It receives change packages via WebSocket and sends player commands to the server.

Key Solution: The Domain Layer and Synchronization Layer run in a separate thread(Web Worker). This is necessary to decouple model processing from rendering. While the domain layer updates the model, the browser's main thread remains free for smooth animation performance.

#### Server Architecture
On the server side, the code is implemented using Clean Architecture and is divided into three logical layers that form two separate processes to ensure stability and scalability.

##### Game Core
The Application Layer and Domain Layer constitute the game core. They run in a separate process(Python Process 2 on the diagram).

* **Domain Layer:** Contains the pure, independent business logic(entity behavior, environment changes, genetics, etc.). This logic runs in an infinite loop, where each simulation iteration occurs once per second.
* **Application Layer:** This is the outer layer of the game core. It manages the execution of incoming commands by handling data serialization and deserialization, and invoking use cases(services) from the Domain Layer.

##### Outer Layer
* **Infrastructure Layer:** This is the outer layer responsible for communication with the external world and resource management. This is where HTTP requests and WebSocket connections are handled, along with database management, email sending, and communication with the game core via the Engine Adapter, which uses a Redis channel(pub/sub) for message exchange.

The placement of the game core(Domain + Application Layers) in a separate process(Python Process 2) prevents the web server's operations, HTTP request processing, or database queries from affecting the stability and speed of the game world.

### **Tech Stack**
* **Client side**: JavaScript, Pixi.js/WebGL, WebWorker, WebSocket, Webpack
* **Server side**: Python 3, Django 5, Redis(as IPC), Multiprocessing(Custom Game Engine), Google OAuth 2.0 & SMTP, Docker, Caddy 2, SQLite(since RAM limit on free VPS)

### ***Composition Roots:***
* [Game Engine](https://github.com/adevianin/bugs/blob/master/bugs/engine_start.py)
* [Engine Adapter](https://github.com/adevianin/bugs/blob/master/bugs/main/init.py)
* [Client Game App](https://github.com/adevianin/bugs/blob/master/bugs/client/gameApp/src/index.js)

### **Performance Tests**

* **Test with ~4K Ants:** [YouTube Video](https://www.youtube.com/watch?v=fsOqnIcIcdM)
  _Note: See video description on YouTube for test conclusions._
* **Test with ~8K Ants:** [YouTube Video](https://www.youtube.com/watch?v=vmhddQBWWTw)

### **Development Showcase**

* **Early Stages of Development:** [YouTube Video](https://www.youtube.com/watch?v=pUTJYvNdoUg)


