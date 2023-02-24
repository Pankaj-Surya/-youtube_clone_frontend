let arr = [1122,2322,3222,4233,5333,6343,733,8910];

console.log("Old Arr : ",arr)

let userId =4233;

console.log("Find Idx : ",arr.findIndex((id) => id===userId))

arr.splice(
    arr.findIndex((id) => id===userId),1
)
console.log("New Arr : ",arr)

console.log("============================")

function filterItems(arr, query) {
  return arr.filter((el) => el.includes(query));
}

let num =  ["111","2322","354","3533","3454","2333"]
console.log(filterItems(num,"33" )); // [ '3533', '2333' ] 