var sha256 = function sha256(ascii) {
	function rightRotate(value, amount) {
		return (value>>>amount) | (value<<(32 - amount));
	};
	
	var mathPow = Math.pow;
	var maxWord = mathPow(2, 32);
	var lengthProperty = 'length';
	var i, j; // Used as a counter across the whole file
	var result = '';

	var words = [];
	var asciiBitLength = ascii[lengthProperty]*8;
	
	//* caching results is optional - remove/add slash from front of this line to toggle
	// Initial hash value: first 32 bits of the fractional parts of the square roots of the first 8 primes
	// (we actually calculate the first 64, but extra values are just ignored)
	var hash = sha256.h = sha256.h || [];
	// Round constants: first 32 bits of the fractional parts of the cube roots of the first 64 primes
	var k = sha256.k = sha256.k || [];
	var primeCounter = k[lengthProperty];
	/*/
	var hash = [], k = [];
	var primeCounter = 0;
	//*/

	var isComposite = {};
	for (var candidate = 2; primeCounter < 64; candidate++) {
		if (!isComposite[candidate]) {
			for (i = 0; i < 313; i += candidate) {
				isComposite[i] = candidate;
			}
			hash[primeCounter] = (mathPow(candidate, .5)*maxWord)|0;
			k[primeCounter++] = (mathPow(candidate, 1/3)*maxWord)|0;
		}
	}
	
	ascii += '\x80'; // Append '1' bit (plus zero padding)
	while (ascii[lengthProperty]%64 - 56) ascii += '\x00'; // More zero padding
	for (i = 0; i < ascii[lengthProperty]; i++) {
		j = ascii.charCodeAt(i);
		if (j>>8) return; // ASCII check: only accept characters in range 0-255
		words[i>>2] |= j << ((3 - i)%4)*8;
	}
	words[words[lengthProperty]] = ((asciiBitLength/maxWord)|0);
	words[words[lengthProperty]] = (asciiBitLength)
	
	// process each chunk
	for (j = 0; j < words[lengthProperty];) {
		var w = words.slice(j, j += 16); // The message is expanded into 64 words as part of the iteration
		var oldHash = hash;
		// This is now the "working hash", often labelled as variables a...g
		// (we have to truncate as well, otherwise extra entries at the end accumulate
		hash = hash.slice(0, 8);
		
		for (i = 0; i < 64; i++) {
			var i2 = i + j;
			// Expand the message into 64 words
			// Used below if 
			var w15 = w[i - 15], w2 = w[i - 2];

			// Iterate
			var a = hash[0], e = hash[4];
			var temp1 = hash[7]
				+ (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) // S1
				+ ((e&hash[5])^((~e)&hash[6])) // ch
				+ k[i]
				// Expand the message schedule if needed
				+ (w[i] = (i < 16) ? w[i] : (
						w[i - 16]
						+ (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15>>>3)) // s0
						+ w[i - 7]
						+ (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2>>>10)) // s1
					)|0
				);
			// This is only used once, so *could* be moved below, but it only saves 4 bytes and makes things unreadble
			var temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) // S0
				+ ((a&hash[1])^(a&hash[2])^(hash[1]&hash[2])); // maj
			
			hash = [(temp1 + temp2)|0].concat(hash); // We don't bother trimming off the extra ones, they're harmless as long as we're truncating when we do the slice()
			hash[4] = (hash[4] + temp1)|0;
		}
		
		for (i = 0; i < 8; i++) {
			hash[i] = (hash[i] + oldHash[i])|0;
		}
	}
	
	for (i = 0; i < 8; i++) {
		for (j = 3; j + 1; j--) {
			var b = (hash[i]>>(j*8))&255;
			result += ((b < 16) ? 0 : '') + b.toString(16);
		}
	}
	return result;
};
class Block{
	constructor(index,timestamp,data,previousHash='',height){
    	this.index=index;
    	this.timestamp=timestamp;
    	this.data=data;
    	this.previousHash='';
    	this.hash=this.calculateHash();
    	this.height=0;
}
	calculateHash(){
		return sha256(this.index +this.previousHash +this.timestamp +JSON.stringify(this.data)+this.height).toString();	
}
}
class Blockchain{
	constructor(){
		this.chain=[this.createGenesisBlock()];
	}
	createGenesisBlock(){
		return new Block("a","01/01/2017","Genesis Block","none");
	}
	getLatestBlock(){
		return this.chain[this.chain.length-1];
		
		
	}
	addBlock(newBlock){
		newBlock.previousHash=this.getLatestBlock().hash;
		newBlock.hash=newBlock.calculateHash();
		newBlock.height=this.chain.length;
		this.chain.push(newBlock);
        
        	}

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }

        return true;
    }    	
}
let nayan=new Blockchain();
nayan.addBlock(new Block("b","10/07/2017",{amount:4}));
nayan.addBlock(new Block("c", "20/07/2017", { amount: 11 }));
nayan.addBlock(new Block("d", "30/08/2017", { amount: 156 }));

console.log(JSON.stringify(nayan,null,4));


   window.onload = (function () {
            document.getElementById("0").value =nayan["chain"][0]["index"];
            document.getElementById("1").value =nayan["chain"][0]["timestamp"];
            document.getElementById("2").value =nayan["chain"][0]["data"];
            document.getElementById("3").value =nayan["chain"][0]["previousHash"];
            document.getElementById("4").value =nayan["chain"][0]["hash"];
            document.getElementById("5").value =nayan["chain"][0]["height"];

           

            document.getElementById("6").value =nayan["chain"][1]["index"];
            document.getElementById("7").value =nayan["chain"][1]["timestamp"];
            document.getElementById("8").value =nayan["chain"][1]["data"]["amount"];
            document.getElementById("9").value =nayan["chain"][1]["previousHash"];
            document.getElementById("10").value =nayan["chain"][1]["hash"];
            document.getElementById("11").value =nayan["chain"][1]["height"];



            document.getElementById("12").value =nayan["chain"][2]["index"];
            document.getElementById("13").value =nayan["chain"][2]["timestamp"];
            document.getElementById("14").value =nayan["chain"][2]["data"]["amount"];
            document.getElementById("15").value =nayan["chain"][2]["previousHash"];
            document.getElementById("16").value =nayan["chain"][2]["hash"];
            document.getElementById("17").value =nayan["chain"][2]["height"];

            

           	document.getElementById("18").value =nayan["chain"][3]["index"];
            document.getElementById("19").value =nayan["chain"][3]["timestamp"];
            document.getElementById("20").value =nayan["chain"][3]["data"]["amount"];
            document.getElementById("21").value =nayan["chain"][3]["previousHash"];
            document.getElementById("22").value =nayan["chain"][3]["hash"];
            document.getElementById("23").value =nayan["chain"][3]["height"];
        
 var person = prompt("Please enter your transaction value for Block Index :e and height:4", "");
    if (person != null) {
        document.getElementById("26").value =person;
        nayan.addBlock(new Block("e", "12/09/2017", { amount: person  }));
        	document.getElementById("24").value =nayan["chain"][4]["index"];
            document.getElementById("25").value =nayan["chain"][4]["timestamp"];
            document.getElementById("27").value =nayan["chain"][4]["previousHash"];
            document.getElementById("28").value =nayan["chain"][4]["hash"];
            document.getElementById("29").value =nayan["chain"][4]["height"];

}



}
         


//UNCOMMENT THE BELOW CODE TO CHECK THE VALIDITY OF THE CHAIN i.e. if someone changes the data ,the chain will be invalid 
//Open in console log and check
//console.log(nayan.isChainValid())
//nayan["chain"][1]["data"]["amount"]=100
//console.log(nayan.isChainValid())
             
        );


    


