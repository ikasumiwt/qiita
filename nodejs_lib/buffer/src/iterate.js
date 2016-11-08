const buf = Buffer.from([1, 2, 3]);

// Prints:
//   1
//   2
//   3
for (var b of buf) {
  console.log(b);
}

console.log('-- buf.values');
// values
for(var a of buf.values()){
  console.log(a);
}

console.log('-- buf.values');

for(var a of buf.values()){
  console.log(a)
}
console.log('-- buf.keys');
for(var a of buf.keys()){
  console.log(a)
}

console.log('-- buf.entries');

for(var a of buf.entries()){
  console.log(a)
}



