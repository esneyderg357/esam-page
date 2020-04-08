const SERVER='https://apiesamweb.esamcca.com/graphql';
document.addEventListener('DOMContentLoaded', function() {
	 app=new Vue({
	    	el:'#app',
	    	data:{
	    		sedes:[],
	    		s:0,
	    		programas:[],
	    		galeria:[{foto:'e1.jpg',descripcion:'Diplomado en emergencias médicas'},
	    				{foto:'e2.jpg',descripcion:'Maestría en recursos humanos'},
	    				{foto:'e3.jpg',descripcion:'Maestría en ecografía'},
	    				{foto:'e4.jpg',descripcion:'Diplomado en ciencias forenses'},
	    				{foto:'e5.jpg',descripcion:''},
	    				{foto:'e6.jpg',descripcion:''},
	    				{foto:'e7.jpg',descripcion:''},
	    				{foto:'e8.jpg',descripcion:''},
	    				{foto:'e9.jpg',descripcion:'Maestria en instrumentación Quirúrgica'},
	    				{foto:'e10.jpg',descripcion:'Maestría en Derecho Notarial'},
	    				{foto:'e11.jpg',descripcion:'Maestría en Derecho Procesal Penal'},
	    				{foto:'e12.jpg',descripcion:'Maestría en Ingeniería Vial'}]
	    	},
	    	methods:{
	    		getsedes: function(){
	    			//global.commit('cargar',true);
	    			axios.post(SERVER,{
	    				query: `query{sedes(estado:true){id,nombre,direccion,telefono_fijo,telefono1,telefono2,latitud,longitud}}`
	    			}).then((res)=>{
	    				lista = res.data.data.sedes;
	    				this.sedes = lista;
	    			}).catch((error)=>{
	    				//n_error(error);
	    			}).finally(()=> {
	    	    		this.initMaps(this.s);
	    			});
	    		},
	    		getultimosprogramas: function(){
	    			//global.commit('cargar',true);
	    			axios.post(SERVER,{
	    				query: `query{programas(latest:true,por_fecha:true){id,version,grupo,fecha_inicio,arte,portada,
	    						postgrado{nombre,categoria{nombre}},sede{nombre},universidad{nombre}}}`
	    			}).then((res)=>{
	    				lista = res.data.data.programas;
	    				lista.pop();
	    				this.programas = lista;
	    			}).catch((error)=>{
	    				//n_error(error);
	    			}).finally(function () {
	    				//global.commit('cargar',false);
	    			});
	    		},
	    		initMaps:function(i){
	    				/*map=new google.maps.Map(document.getElementById('map'), {
	        		        center: {lat: this.sedes[i].latitud, lng: this.sedes[i].longitud},
	        		        zoom: 16
		        		});
		    		    var marker = new google.maps.Marker({
		    		          position: {lat: this.sedes[i].latitud, lng: this.sedes[i].longitud},
		    		          map: map,
		    		          title: 'ESAM'
		    		    });*/
	    		},
	    		format:function(date){
	    			return moment(parseInt(date)).format('DD/MM/YYYY');
	    		}
	    	},
	    	mounted(){
	    		ready();
	    		this.getsedes();
	    		this.getultimosprogramas();
	    		//$('.gallery a').simpleLightbox({});
	    	}
	    });
	  });
  
