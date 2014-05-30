##Introduction

Spiderman makes it trivial work to write a crawler. It
 works much like alfred workflow and ios storyboard, you write crawler by defining some components, using segues to connet them, finally write some script to specify data that needs to be transfer from one component to the next;

####1. Component

There are a few built-in components, they are:

* initializer: the entry point of the crawler, usually offers a beginning url to a pageProcessor
* pageProcessor: like its name, the page processor
* consoleAdaptor: print  data to conlose 
* mongodbAdaptor:  save data into mongodb
* mysqlAdaptor: save data into mysql

#####2. Segue

You use segue to connect components, write some script(jquery support) to fetch the data wanted, and finally use the offer method to transfer data to the next component.

####3. Example

Let's write a crawler

* You first define an initializer, offer a beginning url to a componnent called 'shopList'.
* In 'shopList', there are two segues: first fetch the shop url and send it to 'shop', meanwhile, fetch the next-page link and send it to self.
* In 'shop', fetch the shop name and contrust a shop object, finally send it to mongodb.
* The 'mongodb' will persist the record in a collection called 'shop'.


The whole logic is stored in this form:


	components:
	  initializer:   
	    type: initializer
	    segues:
	      - to: shopList
	        func: 
	          |
	          offer("http://www.dianping.com/search/category/1/0");
	  shopList:   
	    type: pageProcessor
	    segues:
	      - to: shopList
	        func: 
	          |
	          var nextPage=$(".NextPage");
	          if(!nextPage){
	          	  return;
	          }         
	          offer("http://www.dianping.com"+nextPage.attr("href"));
	      - to: shop
	        func: 
	          |
	          $(".BL").each(function() {
	          	  offer("http://www.dianping.com"+($(this).attr("href")));
	          })
	  shop:   
	    type: pageProcessor
	    segues:
	      - to: mongodb
	        func: 
	          |
	          offer({
	          	  shopName:$(".shop-title").text()
	          });
	  mongodb:   
	    type: mongodbAdaptor
	    host: 127.0.0.1
	    port: 27017
	    collection: shop


##Usage

#### 1. Installation

	npm install -g spiderman-crawler
	
#### 2. Run a crawler

The sample config files are listed in the samples folder, run a crawler by:

	spiderman run -p [path to the config file]
	
##Program API

Spiderman also provide the program api:

	var Spiderman = require('spiderman-crawler');
	new Spiderman({
			configFile: 'path ro the config file'
		}).start();

