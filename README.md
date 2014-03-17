Spiderman works much like alfred workflow and ios storyboard, you write crawler by defining some components, using segues to connet them, finally write some script to specify data that needs to be transfer from one component to the next;

The whole logic is stored in this form:

	startup:
	  url: http://www.dianping.com/search/category/1/0
	  component: shopList
	components:
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
