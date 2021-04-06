# **Schemas**
___  


## *Explore*

### **Country Schema**

```JSON5
    {
    	name: String,
    	description: String,
    	banner: [String],
    	place: [Place],
    	blog: [Blog],
    	tourPlan: [TourPlan],
    	event: [Event]
    }
```  


### **Place Schema**

```JSON5
    {
    	name: String,
    	description: String,
    	banner: [String],
    	country: Country,
    	pedia: Pedia,
    	blog: [Blog],
    	tourPlan: [TourPlan],
    	event: [Event]
    }
```  


### **Category Schema**

```JSON5
    {
    	name: String,
    	description: String,
    	banner: [String],
    	travelAgency: [TravelAgency],
    	place: [Place],
    	blog: [Blog],
    	tourPlan: [TourPlan],
    	event: [Event]
    }
```  
