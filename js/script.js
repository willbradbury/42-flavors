(function(window, document, undefined) {

  /* Sets a random integer quantity in range [1, 20] for each flavor. */
  function setQuantities() {
    var metaElements = document.querySelectorAll("div.flavor div.meta")
    for(var i=0;i<metaElements.length;i++){
      var quantitySpan = document.createElement("span");
      quantitySpan.className = "quantity";
      quantitySpan.innerHTML = "" + (Math.floor(Math.random()*20)+1);
      metaElements[i].insertBefore(quantitySpan,metaElements[i].querySelector("span"));
    }
  }

  /* Extracts and returns an array of flavor objects based on data in the DOM. Each
   * flavor object should contain five properties:
   *
   * element: the HTMLElement that corresponds to the .flavor div in the DOM
   * name: the name of the flavor
   * description: the description of the flavor
   * price: how much the flavor costs
   * quantity: how many cups of the flavor are available
   */
  function extractFlavors() {
    var flavorObjects = [];
    var flavorElements = document.querySelectorAll("div.flavor");

    for(var i=0;i<flavorElements.length;i++){
      flavorObjects.push({
        "element" : flavorElements[i],
        "name" : flavorElements[i].querySelector("div.description h2").innerHTML,
        "description" : flavorElements[i].querySelector("div.description p").innerHTML,
        "price" : parseFloat(flavorElements[i].querySelector("span.price").innerHTML.slice(1)),
        "quantity" : parseInt(flavorElements[i].querySelector("span.quantity").innerHTML) 
      });
    }

    return flavorObjects;
  }

  /* Calculates and returns the average price of the given set of flavors. The
   * average should be rounded to two decimal places. */
  function calculateAveragePrice(flavors) {
    var priceSum = 0;
    flavors.forEach(function(flavor){
      priceSum += flavor.price;
    });
    return (priceSum/flavors.length).toFixed(2);
  }

  /* Finds flavors that have prices below the given threshold. Returns an array
   * of strings, each of the form "[flavor] costs $[price]". There should be
   * one string for each cheap flavor. */
  function findCheapFlavors(flavors, threshold) {
    return flavors.filter(function(flavor){
      return flavor.price < threshold;
    }).map(function(flavor){
      return flavor.name + " costs $" + flavor.price;
    });
  }

  /* Populates the select dropdown with options. There should be one option tag
   * for each of the given flavors. */
  function populateOptions(flavors) {
    var dropDown = document.querySelector("select[name=flavor]");
    dropDown.removeChild(dropDown.children[0]);
    flavors.forEach(function(flavor,index){
      var child = dropDown.appendChild(document.createElement("option"));
      child.innerHTML = flavor.name;
      child.setAttribute("value",index);
    });
  }

  /* Processes orders for the given set of flavors. When a valid order is made,
   * decrements the quantity of the associated flavor. */
  function processOrders(flavors) {
    document.getElementsByTagName("form")[0].addEventListener("submit",function(event){
      event.preventDefault();
      var flavor = flavors[parseInt(event.target.getElementsByTagName("select")[0].value)];
      var amount = event.target.querySelector("input[name=amount]");
      if(!amount.value) return;
      if(flavor.quantity - parseInt(amount.value) < 0) return;
      flavor.element.getElementsByClassName("quantity")[0].innerHTML = flavor.quantity - parseInt(amount.value);
      flavor.quantity -= parseInt(amount.value);
      amount.value = "";
    });
  }

  /* Highlights flavors when clicked to make a simple favoriting system. */
  function highlightFlavors(flavors) {
    flavors.forEach(function(flavor){
      flavor.element.addEventListener("click",function(event){
        flavor.element.classList.toggle("highlighted");
      });
    });
  }


  /***************************************************************************/
  /*                                                                         */
  /* Please do not modify code below this line, but feel free to examine it. */
  /*                                                                         */
  /***************************************************************************/


  var CHEAP_PRICE_THRESHOLD = 1.50;

  // setting quantities can modify the size of flavor divs, so apply the grid
  // layout *after* quantities have been set.
  setQuantities();
  var container = document.getElementById('container');
  new Masonry(container, { itemSelector: '.flavor' });

  // calculate statistics about flavors
  var flavors = extractFlavors();
  var averagePrice = calculateAveragePrice(flavors);
  console.log('Average price:', averagePrice);

  var cheapFlavors = findCheapFlavors(flavors, CHEAP_PRICE_THRESHOLD);
  console.log('Cheap flavors:', cheapFlavors);

  // handle flavor orders and highlighting
  populateOptions(flavors);
  processOrders(flavors);
  highlightFlavors(flavors);

})(window, document);