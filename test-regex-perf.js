import fs from 'fs';

async function test() {
  const text = "![" + "a".repeat(10000) + "](" + "b".repeat(10000) + ")";
  const t1 = Date.now();
  text.replace(/!\[.*?\]\([^)]*\)/g, '');
  console.log('Time:', Date.now() - t1, 'ms');
  
  const text2 = "![a] b ] c ] d ] e ] f ] g ] h ] i ] j ] k ] l ] m ] n ] o ] p ] q ] r ] s ] t ] u ] v ] w ] x ] y ] z ]".repeat(100);
  const t2 = Date.now();
  text2.replace(/!\[.*?\]\([^)]*\)/g, '');
  console.log('Time 2:', Date.now() - t2, 'ms');
}

test();
