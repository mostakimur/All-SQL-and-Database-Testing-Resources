mySettings = {	
			onEnter:   		{},
			markupSet:  [ 	{name:'Kal&#305;n Yaz&#305;', key:'B', openWith:'(!(<strong>|!|<b>)!)', closeWith:'(!(</strong>|!|</b>)!)' },
							{name:'&#304;talik', key:'I', openWith:'(!(<em>|!|<i>)!)', closeWith:'(!(</em>|!|</i>)!)'  },
							{separator:'---------------' },
							{name:'Al&#305;nt&#305;', key:'Q', openWith:'<blockquote>', closeWith:'</blockquote>'  },
							{separator:'---------------' },
							{name:'Clean', className:'clean', replaceWith:function(h) { return h.selection.replace(/<(.*?)>/g, "") } },
							
							{name:'Preview', className:'preview', call:'preview' }							
						]
					}