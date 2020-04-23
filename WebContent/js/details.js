const SERVER='https://webapi.esamcca.com/graphql';
document.addEventListener('DOMContentLoaded', function() {
	 app=new Vue({
	    	el:'#app',
	    	data:{
	    		programas_menu:[],
	    		programa:{
	    			id:0,
	    			version:0,
	    			grupo:0,
	    			fecha_inicio: '-',
	    			fecha_fin: '-',
	    			postgrado:{
	    				nombre:'',
	        			objetivo:'',
	        			duracion: 0,
	        			creditaje: '',
	        			dirigido: '',
	        			categoria:{nombre:''}
	    			},
					 sede:{
							nombre:'',
							direccion:'',
							telefono_fijo:'',
							telefono1:'',
							telefono2:'',
							facebook:'',
							latitud:'',
							longitud:''
							},
					universidad:{nombre:''}
	    			}
	    	},
	    	methods:{
	    		getid:function() {  
		    		key="id";
		            key = key.replace(/[\[]/, '\\[');  
		            key = key.replace(/[\]]/, '\\]');
		            var regex = new RegExp("[\\?&]" + key + "=([^&#]*)");  
		            var url = unescape(window.location.href);  
		            var results = regex.exec(url);  
		            if (results === null) {  
		                return null;  
		            } else {  
		                return results[1];  
		            }  
		        },
				cargar:function(){
					axios.post(SERVER, {
						query:`query{programa(id:`+this.getid()+`){id,postgrado{nombre,duracion,creditaje,dirigido,objetivo,categoria{nombre}},
							   version,grupo,fecha_inicio,fecha_fin,arte,portada,sede{id,nombre,direccion,telefono_fijo,telefono1,telefono2,latitud,longitud},universidad{nombre}}}`
						
					}).then((res)=> {
						datos=res.data.data.programa;
						this.programa=datos;
					}).catch((error)=>{
						//n_error(error);
					}).finally(()=> {
						//global.commit('cargar',false);
						this.initMaps();
					});
				},
	    		getprogramasmenu:function(){
	    			axios.post(SERVER, {
	    				query:`query{
								  programas(por_fecha:false,idsede:`+this.sedes[this.s].id+`){
								    id,postgrado{nombre,categoria{nombre}},version,grupo}
								}`
	    			}).then((res)=> {
	    				datos=res.data.data.programas;
	    				this.programas_menu=datos;
	    			}).catch((error)=>{
	    				//n_error(error);
	    			}).finally(()=> {
	    				//global.commit('cargar',false);
	    				this.activo=true;
	    			});
	    		},
	    		initMaps:function(){
	    				map=new google.maps.Map(document.getElementById('map'), {
	        		        center: {lat: this.programa.sede.latitud, lng: this.programa.sede.longitud},
	        		        zoom: 16
		        		});
		    		    var marker = new google.maps.Marker({
		    		          position: {lat: this.programa.sede.latitud, lng: this.programa.sede.longitud},
		    		          map: map,
		    		          title: this.programa.sede.nombre
		    		    });
	    		},
	    		format:function(date){
	    			return moment(parseInt(date)).format('DD/MM/YYYY');
	    		},
	    		repararImg:function(event){
	    			event.target.src ='webdata/portadas/postgrado_default.png';
	    		},
	    		splitsede:function(name){
	    			array=name.split(' ');
	    			array.shift();
	    			return array.join(' ');
	    		}
	    	},
	    	mounted(){
	    		ready();
	    		this.cargar();
	    	}
	    });
	  });
  
