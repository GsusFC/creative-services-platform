'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ServiceIconExampleProps {
  title: string;
  description: string;
  backgroundColor?: string; // Hacemos la prop opcional para mantener compatibilidad
}

// Ejemplo 1: Brand Strategy - Gráfico ascendente animado
export const BrandStrategyExample = ({ title, description }: ServiceIconExampleProps) => {
  const barCount = 15;
  const bars = Array.from({ length: barCount });
  const barWidth = 682 / barCount;
  
  return (
    <div className="flex flex-col items-center p-4 bg-black/30 rounded-lg">
      <h3 className="text-xl font-druk mb-4">{title}</h3>
      <svg width="200" height="200" viewBox="0 0 682 192">
        <motion.g
          initial="hidden"
          animate="visible"
        >
          {bars.map((_, i) => (
            <motion.rect
              key={i}
              x={barWidth * i}
              y={192}
              width={barWidth}
              height={0}
              fill={i % 3 === 0 ? '#ff0000' : i % 3 === 1 ? '#00ff00' : '#0000ff'}
              initial={{ height: 0, y: 192 }}
              animate={{ 
                height: [0, 40 + Math.random() * 152], 
                y: [192, 192 - (40 + Math.random() * 152)]
              }}
              transition={{ 
                duration: 0.8,
                delay: i * 0.1,
                ease: "easeOut",
                repeat: Infinity,
                repeatType: "reverse",
                repeatDelay: Math.random() * 2 + 1
              }}
            />
          ))}
          
          {/* Línea de tendencia animada */}
          <motion.path
            d="M0,192 L682,192"
            stroke="#000000"
            strokeWidth="2"
            strokeDasharray="5 3"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ 
              pathLength: 1,
              d: [
                "M0,192 L682,192", // Línea plana inicial
                "M0,150 C150,140 300,110 682,50", // Curva ascendente
                "M0,170 C220,150 450,90 682,40", // Otra curva ascendente
                "M0,192 L682,192" // Volver a la línea plana
              ]
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity, 
              repeatType: "loop"
            }}
          />
        </motion.g>
      </svg>
      <p className="mt-4 text-sm text-center">
        {description}
      </p>
    </div>
  );
};

// Ejemplo 2: Branding - Círculos que forman un logotipo
export const BrandingExample = ({ title, description }: ServiceIconExampleProps) => {
  const circlePositions = [
    { cx: 160, cy: 50, r: 30 },
    { cx: 220, cy: 90, r: 25 },
    { cx: 280, cy: 50, r: 30 },
    { cx: 340, cy: 90, r: 25 },
    { cx: 400, cy: 50, r: 30 },
    { cx: 220, cy: 140, r: 25 },
    { cx: 280, cy: 140, r: 30 },
    { cx: 340, cy: 140, r: 25 }
  ];
  
  const logoFormation = {
    hidden: { opacity: 0 },
    visible: (i: number) => ({
      opacity: 1,
      transition: {
        delay: i * 0.1,
      },
    }),
    merge: (i: number) => ({
      x: [0, (341 - circlePositions[i].cx) / 2, 341 - circlePositions[i].cx],
      y: [0, (96 - circlePositions[i].cy) / 2, 96 - circlePositions[i].cy],
      r: [circlePositions[i].r, circlePositions[i].r + 5, 60],
      transition: {
        delay: 2 + i * 0.05,
        duration: 1.5,
        type: "spring",
        stiffness: 50
      }
    }),
    split: (i: number) => ({
      x: [(341 - circlePositions[i].cx), (341 - circlePositions[i].cx) / 2, 0],
      y: [(96 - circlePositions[i].cy), (96 - circlePositions[i].cy) / 2, 0],
      r: [60, circlePositions[i].r + 5, circlePositions[i].r],
      transition: {
        delay: 6 + i * 0.05,
        duration: 1.5,
        type: "spring",
        stiffness: 50
      }
    })
  };
  
  return (
    <div className="flex flex-col items-center p-4 bg-black/30 rounded-lg">
      <h3 className="text-xl font-druk mb-4">{title}</h3>
      <svg width="200" height="200" viewBox="0 0 682 192">
        {circlePositions.map((circle, i) => (
          <motion.circle
            key={i}
            cx={circle.cx}
            cy={circle.cy}
            r={circle.r}
            fill={i % 3 === 0 ? '#ff0000' : i % 3 === 1 ? '#00ff00' : '#0000ff'}
            custom={i}
            initial="hidden"
            animate={["visible", "merge", "split"]}
            variants={logoFormation}
            style={{ transformOrigin: '341px 96px' }}
          />
        ))}
      </svg>
      <p className="mt-4 text-sm text-center">
        {description}
      </p>
    </div>
  );
};

// Ejemplo 3: Digital Product - Interfaz interactiva
export const DigitalProductExample = ({ title, description }: ServiceIconExampleProps) => {
  return (
    <div className="flex flex-col items-center p-4 bg-black/30 rounded-lg">
      <h3 className="text-xl font-druk mb-4">{title}</h3>
      <svg width="200" height="200" viewBox="0 0 682 192">
        {/* Fondo de la "pantalla" */}
        <motion.rect
          x="141"
          y="16"
          width="400"
          height="160"
          rx="8"
          fill="#e0e0e0"
          stroke="#cccccc"
          strokeWidth="2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
        
        {/* Barra de navegación */}
        <motion.rect
          x="141"
          y="16"
          width="400"
          height="30"
          rx="8 8 0 0"
          fill="#cccccc"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          style={{ transformOrigin: '141px 16px' }}
        />
        
        {/* Elementos de la interfaz */}
        {/* Barra lateral */}
        <motion.rect
          x="141"
          y="46"
          width="80"
          height="130"
          fill="#dddddd"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          style={{ transformOrigin: '141px 46px' }}
        />
        
        {/* Elementos menu */}
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.rect
            key={i}
            x="155"
            y={60 + i * 20}
            width="52"
            height="10"
            rx="2"
            fill={i === 2 ? '#00ff00' : '#bbbbbb'}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 1 + i * 0.1 }}
          />
        ))}
        
        {/* Contenido principal */}
        {/* Bloques de contenido */}
        {[0, 1, 2].map((row) => 
          [0, 1].map((col) => (
            <motion.rect
              key={`${row}-${col}`}
              x={230 + col * 150}
              y={60 + row * 40}
              width="140"
              height="30"
              rx="4"
              fill="#ccc"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                duration: 0.5, 
                delay: 1.5 + (row * 2 + col) * 0.1,
                type: "spring"
              }}
              style={{ transformOrigin: `${230 + col * 150 + 70}px ${60 + row * 40 + 15}px` }}
              whileHover={{ scale: 1.05, fill: '#00ff00' }}
            />
          ))
        )}
      </svg>
      <p className="mt-4 text-sm text-center">
        {description}
      </p>
    </div>
  );
};

// Ejemplo 4: Motion Design - Ondas de audio/video
export const MotionDesignExample = ({ title, description }: ServiceIconExampleProps) => {
  return (
    <div className="flex flex-col items-center p-4 bg-black/30 rounded-lg">
      <h3 className="text-xl font-druk mb-4">{title}</h3>
      <svg width="200" height="200" viewBox="0 0 682 192">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <motion.rect
            key={i}
            x="0"
            y={i * 32}
            width="682"
            height="32"
            fill={i % 3 === 0 ? '#ff0000' : i % 3 === 1 ? '#00ff00' : '#0000ff'}
            initial={{ pathLength: 0 }}
            animate={{ 
              scaleX: [1, 0.7 + Math.random() * 0.3, 1], 
              scaleY: [1, 0.8 + Math.random() * 0.4, 1],
              y: [i * 32, i * 32 + Math.sin(i) * 10, i * 32]
            }}
            transition={{ 
              duration: 2 + i * 0.5, 
              repeat: Infinity, 
              repeatType: "mirror" 
            }}
            style={{ transformOrigin: '341px 96px' }}
          />
        ))}
        
        {/* Onda de audio superpuesta */}
        <motion.path
          d="M0,96 Q170.5,20 341,96 Q511.5,172 682,96"
          stroke="#ffffff"
          strokeWidth="3"
          fill="none"
          strokeDasharray="5,5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ 
            pathLength: 1, 
            opacity: [0, 0.7, 0],
            d: [
              "M0,96 Q170.5,20 341,96 Q511.5,172 682,96",
              "M0,96 Q170.5,172 341,96 Q511.5,20 682,96",
              "M0,96 Q170.5,20 341,96 Q511.5,172 682,96",
            ]
          }}
          transition={{ 
            duration: 5, 
            repeat: Infinity,
            repeatType: "loop"
          }}
        />
      </svg>
      <p className="mt-4 text-sm text-center">
        {description}
      </p>
    </div>
  );
};

// Ejemplo 5: Web Development - Red de triángulos
export const WebDevelopmentExample = ({ title, description }: ServiceIconExampleProps) => {
  // Creamos posiciones aleatorias para los nodos de la red
  const nodes = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    x: 100 + Math.random() * 482,
    y: 20 + Math.random() * 152,
    connections: [] as number[]
  }));
  
  // Crear conexiones entre nodos
  nodes.forEach((node, i) => {
    // Cada nodo se conecta con 2-3 nodos cercanos
    const distances = nodes
      .map((otherNode, otherIndex) => ({ 
        index: otherIndex, 
        dist: Math.sqrt(
          Math.pow(node.x - otherNode.x, 2) + 
          Math.pow(node.y - otherNode.y, 2)
        )
      }))
      .filter(n => n.index !== i)
      .sort((a, b) => a.dist - b.dist);
    
    // Conectar con los 2-3 más cercanos
    const connectCount = 2 + Math.floor(Math.random() * 2);
    for (let j = 0; j < Math.min(connectCount, distances.length); j++) {
      node.connections.push(distances[j].index);
    }
  });
  
  // Eliminar conexiones duplicadas (si A->B ya existe, no necesitamos B->A)
  const processedConnections = new Set();
  const connections: [number, number][] = [];
  
  nodes.forEach((node, i) => {
    node.connections.forEach(targetIndex => {
      const connectionKey = [Math.min(i, targetIndex), Math.max(i, targetIndex)].join('-');
      if (!processedConnections.has(connectionKey)) {
        processedConnections.add(connectionKey);
        connections.push([i, targetIndex]);
      }
    });
  });
  
  return (
    <div className="flex flex-col items-center p-4 bg-black/30 rounded-lg">
      <h3 className="text-xl font-druk mb-4">{title}</h3>
      <svg width="200" height="200" viewBox="0 0 682 192">
        {/* Conexiones entre nodos */}
        {connections.map(([source, target], i) => (
          <motion.line
            key={`line-${i}`}
            x1={nodes[source].x}
            y1={nodes[source].y}
            x2={nodes[target].x}
            y2={nodes[target].y}
            stroke={i % 3 === 0 ? '#ff0000' : i % 3 === 1 ? '#00ff00' : '#0000ff'}
            strokeWidth="2"
            strokeDasharray="3,2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.6 }}
            transition={{ duration: 0.8, delay: i * 0.1 }}
          />
        ))}
        
        {/* Nodos (triángulos) */}
        {nodes.map((node, i) => {
          const size = 15 + Math.random() * 15;
          return (
            <motion.polygon
              key={`node-${i}`}
              points={`${node.x},${node.y - size} ${node.x + size},${node.y + size} ${node.x - size},${node.y + size}`}
              fill={i % 3 === 0 ? '#ff0000' : i % 3 === 1 ? '#00ff00' : '#0000ff'}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [0, 1.2, 1], 
                opacity: 1,
                rotate: [0, Math.random() > 0.5 ? 360 : -360, 0]
              }}
              transition={{ 
                duration: 1.5, 
                delay: 0.5 + i * 0.07,
                type: "spring"
              }}
              style={{ transformOrigin: `${node.x}px ${node.y}px` }}
              whileHover={{ scale: 1.3, opacity: 0.8 }}
            />
          );
        })}
        
        {/* Pulsos de actividad en las conexiones */}
        {connections.map(([source, target], i) => {
          if (Math.random() > 0.5) return null; // Solo algunos pulsos
          
          return (
            <motion.circle
              key={`pulse-${i}`}
              r="5"
              fill="#000000"
              opacity="0.8"
              initial={{
                cx: nodes[source].x,
                cy: nodes[source].y,
                scale: 0.5
              }}
              animate={{
                cx: [nodes[source].x, nodes[target].x],
                cy: [nodes[source].y, nodes[target].y],
                scale: [0.5, 0.8, 0.5],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{
                duration: 2,
                delay: 1.5 + i * 0.5,
                repeat: Infinity,
                repeatDelay: 3 + Math.random() * 5
              }}
            />
          );
        })}
      </svg>
      <p className="mt-4 text-sm text-center">
        {description}
      </p>
    </div>
  );
};

// Ejemplo 6: UI/UX Design - Bloques de interfaz
export const UiUxDesignExample = ({ title, description }: ServiceIconExampleProps) => {
  // Definimos una cuadrícula de bloques de interfaz
  const gridSize = 4;
  const gap = 5;
  const blockSize = Math.floor((682 - (gap * (gridSize - 1))) / gridSize);
  
  // Estado inicial y final de la cuadrícula
  const grid = Array.from({ length: gridSize }, (_, rowIndex) =>
    Array.from({ length: gridSize }, (_, colIndex) => ({
      row: rowIndex,
      col: colIndex,
      id: rowIndex * gridSize + colIndex,
    }))
  ).flat();
  
  return (
    <div className="flex flex-col items-center p-4 bg-black/30 rounded-lg">
      <h3 className="text-xl font-druk mb-4">{title}</h3>
      <svg width="200" height="200" viewBox="0 0 682 192">
        {/* Fondo de wireframe */}
        <rect
          x="141"
          y="16"
          width="400"
          height="160"
          rx="8"
          fill="none"
          stroke="rgba(0,0,0,0.1)"
          strokeWidth="1"
          strokeDasharray="4 2"
        />
        
        {/* Bloques de interfaz */}
        {grid.map((block) => {
          const { row, col, id } = block;
          const x = col * (blockSize + gap) + (682 - gridSize * blockSize - (gridSize - 1) * gap) / 2;
          const y = row * (blockSize + gap) + (192 - gridSize * blockSize - (gridSize - 1) * gap) / 2;
          
          // Determina si este bloque se moverá a una posición especial
          const shouldTransform = id % 4 === 0;
          const specialX = shouldTransform ? 682 / 2 - blockSize / 2 : x;
          const specialY = shouldTransform ? 192 / 2 - blockSize / 2 : y;
          const specialWidth = shouldTransform ? blockSize * 1.5 : blockSize;
          const specialHeight = shouldTransform ? blockSize / 2 : blockSize;
          
          return (
            <motion.g key={id}>
              <motion.rect
                x={x}
                y={y}
                width={blockSize}
                height={blockSize}
                fill={id % 3 === 0 ? '#ff0000' : id % 3 === 1 ? '#00ff00' : '#0000ff'}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  x: [x, specialX, x],
                  y: [y, specialY, y],
                  width: [blockSize, specialWidth, blockSize],
                  height: [blockSize, specialHeight, blockSize]
                }}
                transition={{ 
                  duration: 3,
                  delay: id * 0.1,
                  repeat: Infinity,
                  repeatDelay: 1,
                  type: "spring",
                  stiffness: 50
                }}
                style={{ transformOrigin: `${x + blockSize/2}px ${y + blockSize/2}px` }}
              />
              
              {/* Detalles de la interfaz */}
              {id % 3 === 0 && (
                <motion.rect
                  x={x + blockSize * 0.2}
                  y={y + blockSize * 0.2}
                  width={blockSize * 0.6}
                  height={blockSize * 0.1}
                  fill="#000000"
                  opacity={0.5}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.5, 0] }}
                  transition={{ 
                    duration: 2,
                    delay: id * 0.1 + 0.5,
                    repeat: Infinity,
                    repeatDelay: 2
                  }}
                />
              )}
              
              {id % 3 === 1 && (
                <motion.circle
                  cx={x + blockSize * 0.5}
                  cy={y + blockSize * 0.5}
                  r={blockSize * 0.3}
                  fill="none"
                  stroke="#000000"
                  opacity={0.3}
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1, 0] }}
                  transition={{ 
                    duration: 1.5,
                    delay: id * 0.1 + 0.8,
                    repeat: Infinity,
                    repeatDelay: 2.5
                  }}
                />
              )}
            </motion.g>
          );
        })}
      </svg>
      <p className="mt-4 text-sm text-center">
        {description}
      </p>
    </div>
  );
};
