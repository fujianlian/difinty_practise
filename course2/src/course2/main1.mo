import Array "mo:base/Array";
import Int "mo:base/Int";
import Nat "mo:base/Nat";

func quicksort(arr:[Int]) : [Int] {
    var newArr:[var Int] = Array.thaw(arr);
    sort(newArr,0,newArr.size()-1);
    Array.freeze(newArr)
};

func sort(arr:[var Int],low:Nat,high:Nat){
    if(low>=high) return;
    var temp = arr[low];
    var l = low;
     var r = high;
     while(l < r){
        while(arr[r] >= temp and r > l){
            r -= 1;
        };
         arr[l] := arr[r];
        while(arr[l] <= temp and l < r){
              l += 1;
        };
        arr[r] := arr[l];
     };
    arr[r] := temp;
    if(l >= 1) sort(arr,low,l-1);
    sort(arr,l+1,high);
};    
