//dataset can be found at https://www.kaggle.com/datasets/elvinrustam/grocery-dataset 
//variable declarations

//unfiltered lists
var subCategories = getColumn("Groceries", "Sub Category");
var prices = getColumn("Groceries", "Price");
var titles = getColumn("Groceries", "Title");

//filtered lists
var filteredList = [];
var filteredSubCategories = [];
var filteredPrices = [];
var filteredTitles = [];

//list to handle the results of the search
var outputList = [];

//users' grocery list and a respective price list
var userList = [];
var userPrice =[];
var userOutput = [];

//category and image lists to handle cycling through images when chaning dropdown menu
var cats = ["Bakery & Desserts",
  "Candy",
  "Coffee",
  "Cleaning Supplies",
  "Deli",
  "Floral",
  "Gift Baskets",
  "Household",
  "Kirkland Signature Grocery",
  "Laundry Detergent & Supplies",
  "Meat & Seafood",
  "Organic",
  "Pantry & Dry Goods",
  "Paper & Plastic Products",
  "Seafood",
  "Snacks",
];
var images = ["cupcakes.png", //reference - https://www.flaticon.com/free-icon/cupcakes_4464790?term=cupcake&page=2&position=56&origin=search&related_id=4464790
  "candy.png", //reference - https://www.flaticon.com/free-icon/candy_1888900?term=candy&page=1&position=2&origin=search&related_id=1888900
  "coffee-cup.png", //reference - https://www.flaticon.com/free-icon/mop_2868875?term=mop&page=1&position=2&origin=search&related_id=2868875
  "mop.png", //reference - https://www.flaticon.com/free-icon/coffee-cup_924514?term=coffee&page=1&position=2&origin=search&related_id=924514
  "sandwich.png", //reference - https://www.flaticon.com/free-icon/sandwich_8512379?term=sandwich&page=1&position=18&origin=search&related_id=8512379
  "flowers.png", //reference - https://www.flaticon.com/free-icon/flowers_9619548?term=floral&page=1&position=59&origin=search&related_id=9619548
  'gift-basket.png', //reference - https://www.flaticon.com/free-icon/gift-basket_2438182?term=gift+basket&page=1&position=9&origin=search&related_id=2438182
  "Household.png", //reference - https://www.flaticon.com/free-icon/electronics_1261106?term=household&page=1&position=21&origin=search&related_id=1261106
  "grocery.png", //reference - https://www.flaticon.com/free-icon/grocery_1261163?term=grocery&page=1&position=1&origin=search&related_id=1261163
  "detergent.png", //reference - https://www.flaticon.com/free-icon/detergent_8948969?term=laundry+detergent&page=1&position=3&origin=search&related_id=8948969
  "meat.png", //reference - https://www.flaticon.com/free-icon/meat_1046769?term=meat&page=1&position=3&origin=search&related_id=1046769
  "organic-food.png", //reference - https://www.flaticon.com/free-icon/organic-food_2713564?term=organic&page=2&position=2&origin=search&related_id=2713564
  "pasta.png", //reference - https://www.flaticon.com/free-icon/pasta_9126280?term=pasta&page=1&position=14&origin=search&related_id=9126280
  "plastic-cup.png", //reference - https://www.flaticon.com/free-icon/plastic-cup_2707712?term=plastic+cups&page=1&position=29&origin=search&related_id=2707712
  "seafood.png", //reference - https://www.flaticon.com/free-icon/seafood_6170877?term=seafood&page=1&position=1&origin=search&related_id=6170877
  "snack.png" //reference - https://www.flaticon.com/free-icon/snack_2553691?term=snacks&page=1&position=1&origin=search&related_id=2553691
];
  
//These two lists are here to help with the font adjustments
var elementsList= ["inputInstruction",
  "searchLabel",
  "searchInput",
  "groceriesOutput",
  "outputInstruction",
  "largeListOutput",
  "removeLabel"
];
  
var elementsFonts = [11, 11, 13, 13, 10, 13, 13];

//input screen event handlers (Isaac)
onEvent("catDropdown", "change", function() {
  changeImg(getText("catDropdown"));
});

onEvent("searchButton", "click", function() {
  filter(getText("catDropdown"), getText("minPriceInput"), getText("maxPriceInput"));
  setScreen("outputScreen");
  setText("searchInput", "");
  output();
});

onEvent("fullScreenBtn", "click", function() {
  setScreen("listScreen");
  catLists();
  setText("largeListOutput", userOutput.join("\n" + "\n"));
  setText("listTotalPrice", "$" + addPrice());
});

onEvent("fontSlider1", "input", function() {
  changeFontSize(getNumber("fontSlider1"));
});

//output screen event handlers (Isaac + Gustavo)
//(Isaac)
onEvent("searchInput", "input", function() {
  search(getText("searchInput").toLowerCase());
});

//(Gustavo)
onEvent("addListBtn", "click", function() {
  addList(getText("numInput"));
});

//(Isaac)
onEvent("outputHome", "click", function() {
  setScreen("inputScreen");
  setText("minPriceInput", "");
  setText("maxPriceInput", "");
});

//(Isaac)
onEvent("fontSlider2", "input", function() {
  changeFontSize(getNumber("fontSlider2"));
});

//list screen event handlers (Isaac)
onEvent("removeButton", "click", function() {
  itemRemove(getNumber("removeInput"));
  setText("listTotalPrice", "$" + addPrice());
});

onEvent("listHome", "click", function() {
  setScreen("inputScreen");
});

onEvent("deleteListBtn", "click", function() {
  userList = [];
  userPrice = [];
  setText("largeListOutput", "");
  setText("listTotalPrice", "$");
});

onEvent("fontSlider3", "input", function() {
  changeFontSize(getNumber("fontSlider3"));
});

//functions

//function to cycle image when dropdown is changed (Isaac)
function changeImg (img) {
  var index = cats.indexOf(img);
  setProperty("image", "image", images[index]);
}

//function to filter the filterd lists based on arguments passed (Isaac)
function filter(cat, minPrice, maxPrice) {
  filteredSubCategories = [];
  filteredPrices = [];
  filteredTitles = [];
  
  //failsafes to account for different inputs
  if (maxPrice == "") {
    maxPrice = 1234567890;
  } else if (maxPrice.substring(0, 1) == "$") {
    maxPrice = maxPrice.substring(1);
  }
  maxPrice = maxPrice*1; /* Title: How to Convert a String to a Number in JavaScript
                            Author: Jessica Wilkins
                            Date: May 2, 2022
                            Availability: https://www.freecodecamp.org/news/how-to-convert-a-string-to-a-number-in-javascript/ */
  
  if (minPrice == "") {
    minPrice = 0;
  } else if (minPrice.substring(0, 1) == "$") {
    minPrice = minPrice.substring(1);
  }
  minPrice = minPrice*1;
  
  //this loop will append the correct items to the filtered lists
  for (var i = 0; i < titles.length; i++) {
    var itemPrice = 0;
    if (prices[i] != undefined) {
      itemPrice = prices[i].substring(1);
    } else {
      itemPrice = 0;
    }
    itemPrice = itemPrice*1;
    
    if (itemPrice <= maxPrice && itemPrice >= minPrice && subCategories[i] == cat) {
      filteredTitles.push(titles[i]);
      filteredPrices.push(prices[i]);
      filteredSubCategories.push(subCategories[i]);
    }
  }
}

//function to display the filtered results to the user on the output screen (Isaac)
function output() {
  outputList = [];
  //loop to combine the number, name, and price of each item
  for (var i = 0; i < filteredTitles.length; i++) {
    var num = (i + 1).toString();
    var item = num + ". " + filteredTitles[i] + " - " + filteredPrices[i];
    outputList.push(item);
  }
  //conditional to display results or an error message if nothing is found
  var length = outputList.length;
  if (length > 0) {
    setText("groceriesOutput", outputList.join("\n" + "\n"));
  } else {
    setText("groceriesOutput", "Oops, looks like there isn't anything that fits your search! Try widening your parameters to get better results.");
  }
  /*search is called here to populate filteredList. That way, if the user doesn't use the search 
    bar before adding something to the list it doesn't give an error. */
  search(getText("searchInput").toLowerCase());
}

//function to make the search bar work on the output screen (Isaac)
function search(phrase) {
  //call .slice() to create new arrays rather than arrays that will point to outputList
  filteredList = outputList.slice();
  var lowercaseList = outputList.slice(); /* Title: Why does changing one array alters the other?
                                             Authors: Daniel Johansson, Nick Craver
                                             Date: November 18, 2010
                                             Availability: https://stackoverflow.com/questions/4220611/why-does-changing-one-array-alters-the-other */

  //making sure something was actually typed into the search bar when called. If nothing was, then the rest of this won't run
  if (phrase != "") {
    //for loop to make everything in lowercaseList lowercase
    for (var i = 0; i < lowercaseList.length; i++) {
      lowercaseList[i] = lowercaseList[i].toLowerCase();
    }
    //loop and conditional to check if each item includes the same characters in the same order. If something doesn't, it will be removed from the two lists. 
    for (i = lowercaseList.length-1; i >=0; i--){
      if (!(lowercaseList[i].includes(phrase))) {
        lowercaseList.splice(i, 1);
        filteredList.splice(i, 1);
      }
    }
    //Renumbering the list
    for (i = 0; i < filteredList.length; i++) {
      var index = filteredList[i].indexOf(".");
      var num = (i + 1).toString();
      var item = num + "." + filteredList[i].substring(index + 1);
      filteredList[i] = item;
    }
    setText("groceriesOutput", filteredList.join("\n" +"\n"));
  }
}

//function to add an item to the user's list (Gustavo)
function addList(num) {
  var index = num - 1;
  var priceIndex = 0;
  
  //If the user inputted an actual number and not a string, the below code will run and append the name and price of the item to the respective user lists.
  if ((!isNaN(index)) && filteredList.length != 0) {
    priceIndex = filteredList[index].indexOf("$") + 1; 
    userList.push(filteredList[index].substring(3, priceIndex - 4));
    userPrice.push(filteredList[index].substring(priceIndex)*1);
    setText("outputInstruction", filteredList[index].substring(3, priceIndex - 4) + " successfully added to your list!");
  } else {
    setText("outputInstruction", "Please enter a valid number.");
  }
  setText("numInput", "");
}

//function the add upp the price of everything in the user's list (Gustavo + Isaac)
function addPrice() {
  var total = 0;
  //adding everything in userPrice (Gustavo)
  for (var i = 0; i < userPrice.length; i++) {
    total = total + userPrice[i];
  }
  total = Math.round(total*100)/100;
  total = total.toString(); /* Title: JavaScript Number toString()
                               Author: W3 Schools
                               Date: N/A
                               Availability: https://www.w3schools.com/jsref/jsref_tostring_number.asp */
  
  //making sure the tenths and hundredths place are represented even if they are both zero (Isaac)
  if (!total.includes(".")) {
    total = total + ".";
  }
  var dotIndex = total.indexOf(".");
  while (total.substring(dotIndex + 1).length < 2) {
    total = total + "0";
  }
  return total;
}

//function to remove an item from the user's list (Isaac)
function itemRemove(item) {
  if (item <= userList.length) {
    var index = item - 1;
    setText("removeLabel", userList[index] + " successfully removed from your list.");
    removeItem(userList, index);
    removeItem(userPrice, index);
    catLists();
    setText("largeListOutput", userOutput.join("\n" + "\n"));
  }
  setText("removeInput", "");
}

//function to comine userList and userPrice to create one unified list to display (Isaac)
function catLists() {
  userOutput = [];
  for (var i = 0; i < userList.length; i++) {
    userOutput.push(i + 1 + ". " + userList[i] + " - " + "$" + userPrice[i]);
  }
}

//function to adjust the font slide when the font slider is moved (Isaac)
function changeFontSize(change) {
  var sliders = ["fontSlider1", "fontSlider2", "fontSlider3"];
  for (var i = 0; i < elementsList.length; i++) {
    setProperty(elementsList[i], "font-size", elementsFonts[i] + change);
  }
  //adjusting every font slider so it is consistent across screens
  for (i = 0; i < sliders.length; i++) {
    setProperty(sliders[i], "value", change);
  }
}
