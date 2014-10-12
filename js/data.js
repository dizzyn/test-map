var data = {
    "years": ["2014", "2013", "2012", "2011", "2010"],
    "mainState": "czech",
    "metrics": {
        "1": {
            "name": "Výdaje na R&D.",
            "info": "Podíl celkových výdajů na výzkum a vývoj na HDP",
            "desc_suffix": "z HDP tvoří výdaje na R&D",
            "sign": "% "
        },
        "2": {
            "name": "Počet patentů",
            "info": "Počet přihlášených patentů na 1 000 obyvatel",
            "desc_suffix": "patentů na 1 000 obyvatel",
            "sign": "patentů"
        },
        "4": {
            "name": "Počet publikací",
            "info": "Počet citovatelných publikací na 1 000 obyvatel",
            "desc_suffix": "publikací na 1 000 obyvatel",
            "sign": "publikací"
        }
        "5": {
            "name": "Venture kapitál",
            "info": "Investice do start-up a seed venture kapitálu",
            "desc_suffix": "z HDP tvoří investice do venture kapitálu",
            "sign": "% "
        }
        "6": {
            "name": "Připojení k internetu",
            "info": "Podíl domácností připojených k vysokorychlostnímu internetu",
            "desc_suffix": "domácností připojených k vysokorychlostnímu internetu",
            "sign": "%"
        }
        "7": {
            "name": "Výdaje na vzdělávání",
            "info": "Veřejné výdaje na vzdělávání vůči HDP",
            "desc_suffix": "z HDP tvoří veřejné výdaje na vzdělání",
            "sign": "%"
        }
        "8": {
            "name": "High-tech export",
            "info": "Podíl high-tech exportů na celkovém exportu",
            "desc_suffix": "z celkového exportu tvoří high-tech produkty",
            "sign": "%"
        }
        "9": {
            "name": "eGovernment",
            "info": "Podíl domácností komunikujících se státní správou elektronicky",
            "desc_suffix": "domácností komunikuje se státní správou elektronicky",
            "sign": "%"
        }

    },
    "states": {
        "germany": {
            "names": {
                "cs": "Dojčland"
            },
            "pinFix": {
                "x": 80,
                "y": -5
            },
            "metrics": {
                "2010": {
                    "1": [30, 0.05],
                    "2": [60, 30],
                    "3": [100, 2.4]
                },
                "2011": {
                    "1": [0, 0],
                    "2": [100, 30],
                    "3": [100, 2.4]
                },
                "2012": {
                    "1": [0, 0],
                    "2": [100, 30],
                    "3": [100, 3.4]
                },
                "2013": {
                    "1": [40, 40],
                    "2": [20, 30],
                    "3": [100, 8.4]
                },
                "2014": {
                    "1": [50, 10],
                    "2": [70, 70],
                    "3": [100, 5.4]
                }
            }
        },
        "poland": {
            "names": {
                "cs": "Dojčland"
            },
            "pinFix": {
                "x": 80,
                "y": -5
            },
            "metrics": {
                "2014": {
                    "1": [10, 60],
                    "2": [70, 70],
                    "3": [100, 5.4]
                },
                "2013": {
                    "1": [50, 40],
                    "2": [70, 70],
                    "3": [100, 5.4]
                },
                "2012": {
                    "1": [50, 40],
                    "2": [70, 70],
                    "3": [100, 5.4]
                }
            }
        },
        "czech": {
            "names": {
                "cs": "Dojčland"
            },
            "pinFix": {
                "x": 80,
                "y": -5
            },
            "metrics": {
                "2014": {
                    "1": [100, 30],
                    "2": [70, 70],
                    "3": [100, 5.4]
                },
                "2013": {
                    "1": [50, 60],
                    "2": [70, 70],
                    "3": [100, 5.4]
                },
                "2012": {
                    "1": [20, 20],
                    "2": [70, 70],
                    "3": [100, 5.4]
                }
            }
        },
        "sweden": {
            "names": {
                "cs": "Dojčland"
            },
            "pinFix": {
                "x": 80,
                "y": -5
            },
            "metrics": {
                "2014": {
                    "1": [80, 60],
                    "2": [70, 70],
                    "3": [100, 5.4]
                },
                "2013": {
                    "1": [10, 10],
                    "2": [70, 70],
                    "3": [100, 5.4]
                },
                "2012": {
                    "1": [90, 60],
                    "2": [70, 70],
                    "3": [100, 5.4]
                }
            }
        }
    }
}
