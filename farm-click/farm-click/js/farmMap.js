// assets/maps/farmMap.js

// Tamanho de cada tile em pixels
const TILE_SIZE = 32;

// IDs dos tiles:
// 0 = grama
// 1 = caminho (passarela de madeira)
// 2 = centro da casa
// 3 = telhado da casa
// 4 = plantação
// 5 = lago
// 6 = deck / plataforma perto do lago
// 7 = árvore/arbusto
// 8 = pedra

// Dimensões do mapa em tiles
const FARM_MAP_WIDTH = 25;
const FARM_MAP_HEIGHT = 15;

// Mapa aproximado do layout do protótipo
const FARM_MAP_DATA = [
  // y = 0
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  // y = 1
  [0,0,0,0,0,0,0,0,0,0,7,7,7,0,0,0,0,0,0,0,0,0,0,0,0],
  // y = 2
  [0,0,0,0,0,0,0,0,0,7,0,0,0,7,0,0,0,0,0,0,0,0,0,0,0],
  // y = 3 - árvores à esquerda, lago à direita
  [0,0,0,0,7,0,0,0,0,0,0,0,0,0,0,0,0,0,7,0,0,0,5,5,5],
  // y = 4
  [0,0,0,0,7,0,0,0,0,0,0,0,0,0,0,0,0,0,7,0,0,5,5,5,5],
  // y = 5
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,5,5,5],
  // y = 6 - passarela horizontal central
  [0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,6,6,0,0],
  // y = 7 - casas laterais e passarela
  [0,0,0,4,4,4,1,0,0,0,0,0,0,0,0,0,1,0,0,0,4,4,4,0,0],
  // y = 8 - campo esq / casa central / campo dir
  [0,0,0,4,4,4,1,0,0,3,3,3,3,3,0,0,1,0,0,0,4,4,4,0,0],
  // y = 9 - corpo da casa central
  [0,0,0,4,4,4,1,0,0,2,2,2,2,2,0,0,1,0,0,0,4,4,4,0,0],
  // y = 10 - continuidade da casa
  [0,0,0,4,4,4,1,0,0,2,2,2,2,2,0,0,1,0,0,0,4,4,4,0,0],
  // y = 11 - mais um pouco da estrutura
  [0,0,0,4,4,4,1,0,0,3,3,3,3,3,0,0,1,0,0,0,4,4,4,0,0],
  // y = 12 - base / porta central
  [0,0,0,4,4,4,1,0,0,0,2,2,2,0,0,0,1,0,0,0,4,4,4,0,0],
  // y = 13 - passarela vertical até embaixo
  [0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0],
  // y = 14
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];
