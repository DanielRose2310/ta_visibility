# 🗺️ Tel-Aviv Viewshed Visibility Map

An interactive **viewshed visibility analysis** tool that visualizes which areas are visible from different observer locations using **raycasting and interpolation**.

### 📌 **What is Viewshed Visibility?**
Viewshed analysis determines how visible a location is by considering obstacles like buildings and terrain.

Each **node** (map location) receives a **visibility score** by summing up contributions from multiple observer positions:

$$
V(P) = \sum_{j=1}^{M} I_j
$$

Where:
- \( P \) = Target node  
- \( I_j \) = Interpolated visibility score from observer \( j \)  
- \( M \) = Number of observer locations  

### 📐 **Interpolated Visibility Calculation**
For each observer \( j \), we compute the interpolated elevation along the ray to node \( P \):

$$
z_{O_j \rightarrow P} = z_{O_j} + (z_T - z_{O_j}) \times \frac{d}{D}
$$

A node’s **final visibility score** is the sum of all rays:

$$
V(P) = \sum_{j=1}^{M} \mathbb{1} (z_P \geq z_{O_j \rightarrow P})
$$

Where:
- \( \mathbb{1} \) is an **indicator function** returning **1 if the node is totally visible from observer \( j \), 0 if totally blocked**.  

### 🏙️ **Implementation for Tel Aviv**
🔗 [Tel-Aviv Viewshed Visibility Map](https://danielrose2310.github.io/ta_visibility/)

---
📜 **MIT Licensed** | 💡 Created by [@danielrose2310](https://github.com/danielrose2310)
