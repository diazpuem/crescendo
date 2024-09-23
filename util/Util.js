export function Random4Digit() {
    return Math.floor(Math.random() * 9000 + 1000);
} 

export function AlphabeticalComparator(item1, item2)  {
    if(item1.name.toLowerCase() < item2.name.toLowerCase()) return -1;
    if(item1.name.toLowerCase() > item2.name.toLowerCase()) return 1;
    return 0;
};