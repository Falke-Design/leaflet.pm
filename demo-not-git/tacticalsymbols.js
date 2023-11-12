
const ambush = {
  paths: [
    {
      type: 'Space',
      angle: 0,
      pxLength: 50,
      paths: [
        {
          type: 'LineString',
          angle: 0,
          pxLength: 200,
          paths: [
            {
              type: 'LineString',
              angle: 135,
              pxLength: 30,
              paths: []
            },
            {
              type: 'LineString',
              angle: -135,
              pxLength: 30,
              paths: []
            },
          ]
        },
        {
          type: 'LineString',
          angle: 90,
          pxLength: 50,
          paths: [
            {
              type: 'LineString',
              angle: 90,
              pxLength: 100,
              paths: []
            },
            {
              type: 'LineString',
              angle: 10,
              pxLength: 80,
              paths: [
                {
                  type: 'LineString',
                  angle: 80,
                  pxLength: 100,
                  paths: []
                },
                {
                  type: 'LineString',
                  angle: 10,
                  pxLength: 80,
                  paths: [
                    {
                      type: 'LineString',
                      angle: 70,
                      pxLength: 100,
                      paths: []
                    },
                    {
                      type: 'LineString',
                      angle: 10,
                      pxLength: 80,
                      paths: [
                      ]
                    },
                  ]
                },
              ]
            },
          ]
        },
        {
          type: 'LineString',
          angle: -90,
          pxLength: 50,
          paths: [
            {
              type: 'LineString',
              angle: -90,
              pxLength: 100,
              paths: []
            },
            {
              type: 'LineString',
              angle: -10,
              pxLength: 80,
              paths: [
                {
                  type: 'LineString',
                  angle: -80,
                  pxLength: 100,
                  paths: []
                },
                {
                  type: 'LineString',
                  angle: -10,
                  pxLength: 80,
                  paths: [
                    {
                      type: 'LineString',
                      angle: -70,
                      pxLength: 100,
                      paths: []
                    },
                    {
                      type: 'LineString',
                      angle: -10,
                      pxLength: 80,
                      paths: []
                    },
                  ]
                },
              ]
            }
          ]
        },
      ]
    },
    {
      type: 'HandlerPoint',
      rotate: true,
      scale: true,
      angle: 0,
      pxLength: 50,
    }
  ]
};

const block = {
  paths: [
    {
      type: 'LineString',
      angle: 0,
      pxLength: 50,
      edit: {
        first: true
      },
      paths: [
        {
          type: 'Space',
          angle: 0,
          pxLength: 30,
          text: 'B',
          edit: {
            last: false
          },
          paths: [
            {
              type: 'LineString',
              angle: 0,
              pxLength: 50,
              edit: {
                last: true
              },
              paths: [
                {
                  type: 'LineString',
                  angle: 90,
                  pxLength: 70
                },
                {
                  type: 'LineString',
                  angle: -90,
                  pxLength: 70,
                  edit: {
                    last: true
                  }
                },
              ]
            }
          ]
        },
      ]
    },
    {
      type: 'HandlerPoint',
      rotate: true,
      scale: true,
      angle: 0,
      pxLength: 100,
    }
  ]
};

const breach = {
  paths: [
    {
      type: 'Space',
      angle: 90,
      pxLength: 10,
      text: 'B',
    },
    {
      type: 'Space',
      angle: 90,
      pxLength: 50,
      paths: [
        {
          type: 'LineString',
          angle: 0,
          pxLength: 100,
          paths: [
            {
              type: 'LineString',
              angle: -90,
              pxLength: 150,
              paths: [
                {
                  type: 'LineString',
                  angle: -45,
                  pxLength: 50
                },
                {
                  type: 'LineString',
                  angle: 135,
                  pxLength: 50,
                },
              ]
            }
          ]
        },
      ]
    },
    {
      type: 'Space',
      angle: 270,
      pxLength: 50,
      paths: [
        {
          type: 'LineString',
          angle: 0,
          pxLength: 100,
          paths: [
            {
              type: 'LineString',
              angle: 90,
              pxLength: 150,
              paths: [
                {
                  type: 'LineString',
                  angle: -135,
                  pxLength: 50
                },
                {
                  type: 'LineString',
                  angle: 45,
                  pxLength: 50,
                },
              ]
            }
          ]
        },
      ]
    },
    {
      type: 'HandlerPoint',
      rotate: true,
      scale: true,
      angle: 0,
      pxLength: 100,
    }
  ]
};

const bypass = {
  paths: [
    {
      type: 'Space',
      angle: 90,
      pxLength: 10,
      text: 'B',
    },
    {
      type: 'Space',
      angle: 90,
      pxLength: 50,
      paths: [
        {
          type: 'LineString',
          angle: 0,
          pxLength: 100,
          paths: [
            {
              type: 'LineString',
              angle: -90,
              pxLength: 150,
              paths: [
                {
                  type: 'LineString',
                  angle: -135,
                  pxLength: 50
                },
                {
                  type: 'LineString',
                  angle: 135,
                  pxLength: 50,
                },
              ]
            }
          ]
        },
      ]
    },
    {
      type: 'Space',
      angle: 270,
      pxLength: 50,
      paths: [
        {
          type: 'LineString',
          angle: 0,
          pxLength: 100,
          paths: [
            {
              type: 'LineString',
              angle: 90,
              pxLength: 150,
              paths: [
                {
                  type: 'LineString',
                  angle: -135,
                  pxLength: 50
                },
                {
                  type: 'LineString',
                  angle: 135,
                  pxLength: 50,
                },
              ]
            }
          ]
        },
      ]
    },
    {
      type: 'HandlerPoint',
      rotate: true,
      scale: true,
      angle: 0,
      pxLength: 100,
    }
  ]
};

const canalize = {
  paths: [
    {
      type: 'Space',
      angle: 90,
      pxLength: 10,
      text: 'C',
    },
    {
      type: 'Space',
      angle: 90,
      pxLength: 50,
      paths: [
        {
          type: 'LineString',
          angle: 0,
          pxLength: 100,
          paths: [
            {
              type: 'LineString',
              angle: -90,
              pxLength: 150,
              paths: [
                {
                  type: 'LineString',
                  angle: -135,
                  pxLength: 50
                },
                {
                  type: 'LineString',
                  angle: 45,
                  pxLength: 50,
                },
              ]
            }
          ]
        },
      ]
    },
    {
      type: 'Space',
      angle: 270,
      pxLength: 50,
      paths: [
        {
          type: 'LineString',
          angle: 0,
          pxLength: 100,
          paths: [
            {
              type: 'LineString',
              angle: 90,
              pxLength: 150,
              paths: [
                {
                  type: 'LineString',
                  angle: -45,
                  pxLength: 50
                },
                {
                  type: 'LineString',
                  angle: 135,
                  pxLength: 50,
                },
              ]
            }
          ]
        },
      ]
    },
    {
      type: 'HandlerPoint',
      rotate: true,
      scale: true,
      angle: 0,
      pxLength: 100,
    }
  ]
};

const clear = {
  paths: [
    {
      type: 'LineString',
      angle: 0,
      pxLength: 50,
      paths: [
        {
          type: 'Space',
          text: 'C',
          angle: 0,
          pxLength: 50,
          paths: [
            {
              type: 'LineString',
              angle: 0,
              pxLength: 50,
              paths: [
                {
                  type: 'LineString',
                  angle: -135,
                  pxLength: 30
                },
                {
                  type: 'LineString',
                  angle: 135,
                  pxLength: 30,
                },
                {
                  type: 'LineString',
                  angle: -90,
                  pxLength: 130,
                },
                {
                  type: 'LineString',
                  angle: 90,
                  pxLength: 130,
                },
              ]
            }
          ]
        },
      ]
    },
    {
      type: 'Space',
      angle: -90,
      pxLength: 100,
      paths: [
        {
          type: 'LineString',
          angle: 90,
          pxLength: 150,
          paths: [
            {
              type: 'LineString',
              angle: -135,
              pxLength: 30
            },
            {
              type: 'LineString',
              angle: 135,
              pxLength: 30,
            },
          ]
        },
      ]
    },
    {
      type: 'Space',
      angle: 90,
      pxLength: 100,
      paths: [
        {
          type: 'LineString',
          angle: -90,
          pxLength: 150,
          paths: [
            {
              type: 'LineString',
              angle: -135,
              pxLength: 30
            },
            {
              type: 'LineString',
              angle: 135,
              pxLength: 30,
            },
          ]
        },
      ]
    },
    {
      type: 'HandlerPoint',
      rotate: true,
      scale: true,
      angle: 0,
      pxLength: 50,
    }
  ]
};

const contain =  {
  paths: [
    {
      type: 'LineString',
      angle: 0,
      pxLength: 50,
      paths: [
        {
          type: 'Space',
          angle: 0,
          pxLength: 70,
          text: 'ENY',
          paths: [
            {
              type: 'LineString',
              angle: 0,
              pxLength: 50,
              paths: [
                {
                  type: 'LineString',
                  angle: -135,
                  pxLength: 30,
                  paths: []
                },
                {
                  type: 'LineString',
                  angle: 135,
                  pxLength: 30,
                  paths: []
                },
                {
                  type: 'Space',
                  angle: 0,
                  pxLength: 100,
                  paths: [
                    {
                      type: 'Space',
                      angle: 0,
                      text: 'C',
                      pxLength: 50,
                      paths: [
                        {
                          type: 'LineString',
                          angle: 90,
                          pxLength: 50,
                          paths: [
                            {
                              type: 'LineString',
                              angle: 90,
                              pxLength: 50,
                              paths: [
                              ]
                            },
                            {
                              type: 'LineString',
                              angle: 22.5,
                              pxLength: 50,
                              paths: [
                                {
                                  type: 'LineString',
                                  angle: 90,
                                  pxLength: 50,
                                  paths: []
                                },
                                {
                                  type: 'LineString',
                                  angle: 22.5,
                                  pxLength: 50,
                                  paths: [
                                    {
                                      type: 'LineString',
                                      angle: 90,
                                      pxLength: 50,
                                      paths: []
                                    },
                                    {
                                      type: 'LineString',
                                      angle: 22.5,
                                      pxLength: 50,
                                      paths: [
                                        {
                                          type: 'LineString',
                                          angle: 90,
                                          pxLength: 50,
                                          paths: []
                                        },

                                        {
                                          type: 'LineString',
                                          angle: 22.5,
                                          pxLength: 50,
                                          paths: [
                                            {
                                              type: 'LineString',
                                              angle: 90,
                                              pxLength: 50,
                                              paths: []
                                            },
                                          ]
                                        },
                                      ]
                                    },
                                  ]
                                },
                              ]
                            },
                          ]
                        },


                        {
                          type: 'LineString',
                          angle: -90,
                          pxLength: 50,
                          paths: [
                            {
                              type: 'LineString',
                              angle: -90,
                              pxLength: 50,
                              paths: [
                              ]
                            },
                            {
                              type: 'LineString',
                              angle: -22.5,
                              pxLength: 50,
                              paths: [
                                {
                                  type: 'LineString',
                                  angle: -90,
                                  pxLength: 50,
                                  paths: []
                                },
                                {
                                  type: 'LineString',
                                  angle: -22.5,
                                  pxLength: 50,
                                  paths: [
                                    {
                                      type: 'LineString',
                                      angle: -90,
                                      pxLength: 50,
                                      paths: []
                                    },
                                    {
                                      type: 'LineString',
                                      angle: -22.5,
                                      pxLength: 50,
                                      paths: [
                                        {
                                          type: 'LineString',
                                          angle: -90,
                                          pxLength: 50,
                                          paths: []
                                        },
                                        {
                                          type: 'LineString',
                                          angle: -22.5,
                                          pxLength: 50,
                                          paths: [
                                            {
                                              type: 'LineString',
                                              angle: -90,
                                              pxLength: 50,
                                              paths: []
                                            },

                                          ]
                                        },
                                      ]
                                    },
                                  ]
                                },
                              ]
                            },
                          ]
                        },
                      ]
                    },
                  ]
                },
              ]
            },
          ]
        },
      ]
    },
    {
      type: 'HandlerPoint',
      rotate: true,
      scale: true,
      angle: 90,
      pxLength: 50,
    }
  ]
};

const counterAttack = {
  paths: [
    {
      type: 'LineString',
      angle: -90,
      pxLength: 105,
      offset: 25,
      edit: {
        last: ['move','rotate']
      },
      paths: [
        {
          type: 'LineString',
          angle: 45,
          pxLength: 65,
          offset: 25,
          edit: {
            // last: true
            last: ['move','rotate']
          },
          paths: [
            {
              type: 'LineString',
              angle: 45,
              pxLength: 55,
              offset: 25,
              edit: {
                // last: true
                last: ['move','rotate']
              },
              text: 'CATK',
              paths: [
                {
                  type: 'Space',
                  angle: -90,
                  pxLength: 25,
                  paths: [
                    {
                      type: 'LineString',
                      angle: 0 ,
                      pxLength: 45.7,
                      paths: [
                        {
                          type: 'LineString',
                          angle: 135,
                          pxLength: 100,
                          paths: []
                        },
                      ]
                    },
                  ]
                },
                {
                  type: 'Space',
                  angle: 90,
                  pxLength: 25,
                  paths: [
                    {
                      type: 'LineString',
                      angle: 0 ,
                      pxLength: 45.7,
                      paths: [
                        {
                          type: 'LineString',
                          angle: -135,
                          pxLength: 100,
                          paths: []
                        },
                      ]
                    },
                  ]
                }
              ]
            },
          ]
        },
      ]
    },
  ]
};

const counterAttackByFire= {
  paths: [
    {
      type: 'LineString',
      angle: -90,
      pxLength: 105,
      offset: 25,
      edit: {
        last: ['move','rotate']
      },
      paths: [
        {
          type: 'LineString',
          angle: 45,
          pxLength: 65,
          offset: 25,
          edit: {
            // last: true
            last: ['move','rotate']
          },
          paths: [
            {
              type: 'LineString',
              angle: 45,
              pxLength: 55,
              offset: 25,
              edit: {
                // last: true
                last: ['move','rotate']
              },
              text: 'CATK',
              paths: [
                {
                  type: 'Space',
                  angle: -90,
                  pxLength: 25,
                  paths: [
                    {
                      type: 'LineString',
                      angle: 0 ,
                      pxLength: 45.7,
                      paths: [
                        {
                          type: 'LineString',
                          angle: 135,
                          pxLength: 100,
                          paths: []
                        },
                      ]
                    },
                  ]
                },
                {
                  type: 'Space',
                  angle: 90,
                  pxLength: 25,
                  paths: [
                    {
                      type: 'LineString',
                      angle: 0 ,
                      pxLength: 45.7,
                      paths: [
                        {
                          type: 'LineString',
                          angle: -135,
                          pxLength: 100,
                          paths: []
                        },
                      ]
                    },
                  ]
                },
                {
                  type: 'Space',
                  angle: 0,
                  pxLength: 100,
                  paths: [
                    {
                      type: 'LineString',
                      angle: 90,
                      pxLength: 70,
                      paths: [
                        {
                          type: 'LineString',
                          angle: 45,
                          pxLength: 50,
                          paths: []
                        },
                      ]
                    },
                    {
                      type: 'LineString',
                      angle: -90,
                      pxLength: 70,
                      paths: [
                        {
                          type: 'LineString',
                          angle: -45,
                          pxLength: 50,
                          paths: []
                        },
                      ]
                    },
                    {
                      type: 'LineString',
                      angle: 0,
                      pxLength: 50,
                      paths: [
                        {
                          type: 'LineString',
                          angle: -135,
                          pxLength: 20,
                          paths: []
                        },
                        {
                          type: 'LineString',
                          angle: 135,
                          pxLength: 20,
                          paths: []
                        },
                      ]
                    },
                  ]
                },
              ]
            },
          ]
        },
      ]
    },
  ]
};

const cover = {
  paths: [
    {
      type: 'Space',
      angle: -45,
      pxLength: 10,
      paths: [
        {
          type: 'Space',
          angle: 0,
          pxLength: 20,
          text: 'C'
        }
      ]
    },
    {
      type: 'Space',
      angle: -135,
      pxLength: 10,
      paths: [
        {
          type: 'Space',
          angle: 0,
          pxLength: 20,
          text: 'C'
        }
      ]
    },
    {
      type: 'Space',
      angle: 0,
      pxLength: 50,
      paths: [
        {
          type: 'LineString',
          angle: 25,
          pxLength: 100,
          paths: [
            {
              type: 'LineString',
              angle: 90,
              pxLength: 50,
              paths: [
                {
                  type: 'LineString',
                  angle: -90,
                  pxLength: 50,
                  paths: [
                    {
                      type: 'LineString',
                      angle: -135,
                      pxLength: 30,
                    },
                    {
                      type: 'LineString',
                      angle: 135,
                      pxLength: 30,
                    },
                  ]
                },
              ]
            }
          ]
        },
      ]
    },
    {
      type: 'Space',
      angle: -180,
      pxLength: 50,
      paths: [
        {
          type: 'LineString',
          angle: -25,
          pxLength: 100,
          paths: [
            {
              type: 'LineString',
              angle: -90,
              pxLength: 50,
              paths: [
                {
                  type: 'LineString',
                  angle: 90,
                  pxLength: 50,
                  paths: [
                    {
                      type: 'LineString',
                      angle: -135,
                      pxLength: 30,
                    },
                    {
                      type: 'LineString',
                      angle: 135,
                      pxLength: 30,
                    },
                  ]
                },
              ]
            }
          ]
        },
      ]
    },
    {
      type: 'HandlerPoint',
      rotate: true,
      scale: true,
      angle: 90,
      pxLength: 50,
    }
  ]
};

const delay = {
  paths: [
    {
      type: 'LineString',
      angle: 0,
      pxLength: 50,
      paths: [
        {
          type: 'LineString',
          angle: 22.5,
          pxLength: 30,
          paths: [
            {
              type: 'LineString',
              angle: 22.5,
              pxLength: 30,
              paths: [
                {
                  type: 'LineString',
                  angle: 22.5,
                  pxLength: 30,
                  paths: [
                    {
                      type: 'LineString',
                      angle: 22.5,
                      pxLength: 30,
                      paths: [
                        {
                          type: 'LineString',
                          angle: 0,
                          pxLength: 200,
                          paths: [
                            {
                              type: 'LineString',
                              angle: 22.5,
                              pxLength: 30,
                              paths: [
                                {
                                  type: 'LineString',
                                  angle: 22.5,
                                  pxLength: 30,
                                  paths: [
                                    {
                                      type: 'LineString',
                                      angle: 22.5,
                                      pxLength: 30,
                                      paths: [
                                        {
                                          type: 'LineString',
                                          angle: 22.5,
                                          pxLength: 30,
                                          paths: [
                                            {
                                              type: 'LineString',
                                              angle: 0,
                                              pxLength: 70,
                                              paths: [
                                                {
                                                  type: 'Space',
                                                  angle: 0,
                                                  text: 'D',
                                                  pxLength: 50,
                                                  paths: [
                                                    {
                                                      type: 'LineString',
                                                      angle: 0,
                                                      pxLength: 70,
                                                      paths: [
                                                        {
                                                          type: 'LineString',
                                                          angle: -135,
                                                          pxLength: 30,
                                                          paths: []
                                                        },
                                                        {
                                                          type: 'LineString',
                                                          angle: 135,
                                                          pxLength: 30,
                                                          paths: []
                                                        },
                                                      ]
                                                    },
                                                  ]
                                                },
                                              ]
                                            },
                                          ]
                                        },
                                      ]
                                    },
                                  ]
                                },
                              ]
                            },
                          ]
                        },
                      ]
                    },
                  ]
                },
              ]
            },
          ]
        },
      ]
    },
    {
      type: 'HandlerPoint',
      rotate: true,
      scale: true,
      angle: 90,
      pxLength: 170,
    }
  ]
};

const destroy = {
  paths: [
    {
      type: 'Space',
      pxLength: 1,
      text: 'D',
    },
    {
      type: 'Space',
      angle: -35,
      pxLength: 30,
      paths: [
        {
          type: 'LineString',
          angle: 0,
          pxLength: 100,
        },
      ]
    },
    {
      type: 'Space',
      angle: 35,
      pxLength: 30,
      paths: [
        {
          type: 'LineString',
          angle: 0,
          pxLength: 100,
        },
      ]
    },
    {
      type: 'Space',
      angle: -145,
      pxLength: 30,
      paths: [
        {
          type: 'LineString',
          angle: 0,
          pxLength: 100,
        },
      ]
    },
    {
      type: 'Space',
      angle: 145,
      pxLength: 30,
      paths: [
        {
          type: 'LineString',
          angle: 0,
          pxLength: 100,
        },
      ]
    },
    {
      type: 'HandlerPoint',
      rotate: true,
      scale: true,
      angle: -90,
      pxLength: 20,
    }
  ]
}

const disrupt = {
  paths: [
    {
      type: 'LineString',
      angle: 0,
      pxLength: 50,
      paths: [
        {
          type: 'LineString',
          angle: 0,
          pxLength: 40,
          paths: [
            {
              type: 'Space',
              angle: 0,
              pxLength: 40,
              text: 'D',
              paths: [
                {
                  type: 'LineString',
                  angle: 0,
                  pxLength: 30,
                  paths: [
                    {
                      type: 'LineString',
                      angle: -135,
                      pxLength: 20,
                      paths: []
                    },
                    {
                      type: 'LineString',
                      angle: 135,
                      pxLength: 20,
                      paths: []
                    },
                  ]
                },
              ]
            },
          ]
        },
        {
          type: 'LineString',
          angle: 90,
          pxLength: 100,
          paths: [
            {
              type: 'LineString',
              angle: -90,
              pxLength: 140,
              paths: [
                {
                  type: 'LineString',
                  angle: -135,
                  pxLength: 20,
                  paths: []
                },
                {
                  type: 'LineString',
                  angle: 135,
                  pxLength: 20,
                  paths: []
                },
              ]
            },
          ]
        },
        {
          type: 'LineString',
          angle: -90,
          pxLength: 100,
          paths: [
            {
              type: 'LineString',
              angle: 90,
              pxLength: 80,
              paths: [
                {
                  type: 'LineString',
                  angle: -135,
                  pxLength: 20,
                  paths: []
                },
                {
                  type: 'LineString',
                  angle: 135,
                  pxLength: 20,
                  paths: []
                },
              ]
            },
          ]
        },
      ]
    },
    {
      type: 'HandlerPoint',
      rotate: true,
      scale: true,
      angle: 0,
      pxLength: 50,
    }
  ]
}

const fix = {
  paths: [
    {
      type: 'Space',
      angle: 0,
      text: 'F',
      pxLength: 10,
      paths: [
        {
          type: 'LineString',
          angle: 0,
          pxLength: 10,
          paths: [
            {
              type: 'LineString',
              angle: 80,
              pxLength: 40,
              paths: [
                {
                  type: 'LineString',
                  angle: -160,
                  pxLength: 80,
                  paths: [
                    {
                      type: 'LineString',
                      angle: 160,
                      pxLength: 80,
                      paths: [
                        {
                          type: 'LineString',
                          angle: -160,
                          pxLength: 80,
                          paths: [
                            {
                              type: 'LineString',
                              angle: 160,
                              pxLength: 80,
                              paths: [
                                {
                                  type: 'LineString',
                                  angle: -160,
                                  pxLength: 80,
                                  paths: [
                                    {
                                      type: 'LineString',
                                      angle: 160,
                                      pxLength: 40,
                                      paths: [
                                        {
                                          type: 'LineString',
                                          angle: -80,
                                          pxLength: 20,
                                          paths: [
                                            {
                                              type: 'LineString',
                                              angle: -135,
                                              pxLength: 10,
                                              paths: [],
                                            },
                                            {
                                              type: 'LineString',
                                              angle: 135,
                                              pxLength: 10,
                                              paths: []
                                            }
                                          ]
                                        },
                                      ]
                                    },
                                  ]
                                },
                              ]
                            },
                          ]
                        },
                      ]
                    },
                  ]
                },
              ]
            },
          ]
        },
      ]
    },
    {
      type: 'HandlerPoint',
      rotate: true,
      scale: true,
      angle: 0,
      pxLength: 50,
    }
  ]
}

const followAndAssume = null;

const followAndSupport = null;

const guard = {
  paths: [
    {
      type: 'Space',
      angle: -45,
      pxLength: 10,
      paths: [
        {
          type: 'Space',
          angle: 0,
          pxLength: 20,
          text: 'G'
        }
      ]
    },
    {
      type: 'Space',
      angle: -135,
      pxLength: 10,
      paths: [
        {
          type: 'Space',
          angle: 0,
          pxLength: 20,
          text: 'G'
        }
      ]
    },
    {
      type: 'Space',
      angle: 0,
      pxLength: 50,
      paths: [
        {
          type: 'LineString',
          angle: 25,
          pxLength: 100,
          paths: [
            {
              type: 'LineString',
              angle: 90,
              pxLength: 50,
              paths: [
                {
                  type: 'LineString',
                  angle: -90,
                  pxLength: 50,
                  paths: [
                    {
                      type: 'LineString',
                      angle: -135,
                      pxLength: 30,
                    },
                    {
                      type: 'LineString',
                      angle: 135,
                      pxLength: 30,
                    },
                  ]
                },
              ]
            }
          ]
        },
      ]
    },
    {
      type: 'Space',
      angle: -180,
      pxLength: 50,
      paths: [
        {
          type: 'LineString',
          angle: -25,
          pxLength: 100,
          paths: [
            {
              type: 'LineString',
              angle: -90,
              pxLength: 50,
              paths: [
                {
                  type: 'LineString',
                  angle: 90,
                  pxLength: 50,
                  paths: [
                    {
                      type: 'LineString',
                      angle: -135,
                      pxLength: 30,
                    },
                    {
                      type: 'LineString',
                      angle: 135,
                      pxLength: 30,
                    },
                  ]
                },
              ]
            }
          ]
        },
      ]
    },
    {
      type: 'HandlerPoint',
      rotate: true,
      scale: true,
      angle: 90,
      pxLength: 50,
    }
  ]
};

const interdict = {
  paths: [
    {
      type: 'LineString',
      angle: 0,
      pxLength: 50,
      paths: [
        {
          type: 'Space',
          angle: 0,
          pxLength: 30,
          paths: [
            {
              type: 'Space',
              angle: 0,
              text: 'I',
              pxLength: 1,
              paths: []
            },
            {
              type: 'Space',
              angle: 135,
              pxLength: 30,
              paths: [
                {
                  type: 'LineString',
                  angle: 0,
                  pxLength: 50,
                  paths: []
                },
              ]
            },
            {
              type: 'Space',
              angle: -45,
              pxLength: 30,
              paths: [
                {
                  type: 'LineString',
                  angle: 0,
                  pxLength: 50,
                  paths: [
                    {
                      type: 'LineString',
                      angle: -135,
                      pxLength: 20,
                      paths: []
                    },
                    {
                      type: 'LineString',
                      angle: 135,
                      pxLength: 20,
                      paths: []
                    },
                  ]
                },
              ]
            },
            {
              type: 'Space',
              angle: 0,
              pxLength: 30,
              paths: [
                {
                  type: 'LineString',
                  angle: 0,
                  pxLength: 50,
                  paths: [
                    {
                      type: 'LineString',
                      angle: -135,
                      pxLength: 20,
                      paths: []
                    },
                    {
                      type: 'LineString',
                      angle: 135,
                      pxLength: 20,
                      paths: []
                    },
                  ]
                },
              ]
            },
          ]
        },
      ]
    },
    {
      type: 'HandlerPoint',
      rotate: true,
      scale: true,
      angle: 90,
      pxLength: 50,
    }
  ]
};

const isolate = null;

const neutralize = {
  paths: [
    {
      type: 'Space',
      pxLength: 1,
      text: 'N',
    },
    {
      type: 'Space',
      angle: -35,
      pxLength: 30,
      paths: [
        {
          type: 'LineString',
          angle: 0,
          pxLength: 25,
          paths: [
            {
              type: 'Space',
              angle: 0,
              pxLength: 8,
              paths: [
                {
                  type: 'LineString',
                  angle: 0,
                  pxLength: 25,
                  paths: [
                    {
                      type: 'Space',
                      angle: 0,
                      pxLength: 8,
                      paths: [
                        {
                          type: 'LineString',
                          angle: 0,
                          pxLength: 25,
                          paths: [
                          ]
                        },
                      ]
                    },
                  ]
                },
              ]
            },
          ]
        },
      ]
    },
    {
      type: 'Space',
      angle: 35,
      pxLength: 30,
      paths: [
        {
          type: 'LineString',
          angle: 0,
          pxLength: 100,
        },
      ]
    },
    {
      type: 'Space',
      angle: -145,
      pxLength: 30,
      paths: [
        {
          type: 'LineString',
          angle: 0,
          pxLength: 100,
        },
      ]
    },
    {
      type: 'Space',
      angle: 145,
      pxLength: 30,
      paths: [
        {
          type: 'LineString',
          angle: 0,
          pxLength: 25,
          paths: [
            {
              type: 'Space',
              angle: 0,
              pxLength: 8,
              paths: [
                {
                  type: 'LineString',
                  angle: 0,
                  pxLength: 25,
                  paths: [
                    {
                      type: 'Space',
                      angle: 0,
                      pxLength: 8,
                      paths: [
                        {
                          type: 'LineString',
                          angle: 0,
                          pxLength: 25,
                          paths: [
                          ]
                        },
                      ]
                    },
                  ]
                },
              ]
            },
          ]
        },
      ]
    },
    {
      type: 'HandlerPoint',
      rotate: true,
      scale: true,
      angle: -90,
      pxLength: 20,
    }
  ]
}

const occupy = null;

const penetrate = {
  // startPoint: [9.640784, 47.330542],
  paths: [
    {
      type: 'LineString',
      angle: 45,
      pxLength: 50,
      edit: {
        first: true
      },
      paths: [
        {
          type: 'Space',
          angle: 0,
          pxLength: 30,
          text: 'P',
          edit: {
            last: false
          },
          paths: [
            {
              type: 'LineString',
              angle: 0,
              pxLength: 50,
              edit: {
                last: true
              },
              arrow: {
                first: false,
                last: true,
              },
              paths: [
                {
                  type: 'LineString',
                  angle: 90,
                  pxLength: 70
                },
                {
                  type: 'LineString',
                  angle: -90,
                  pxLength: 70,
                  edit: {
                    last: true
                  }
                },
              ]
            }
          ]
        },
      ]
    },
    {
      type: 'HandlerPoint',
      rotate: true,
      scale: true,
      angle: 45,
      pxLength: 100,
    }
  ]
};

const reliefInPlace = {
  paths: [
    {
      type: 'LineString',
      angle: 45,
      pxLength: 30,
      paths: []
    },
    {
      type: 'LineString',
      angle: -45,
      pxLength: 30,
      paths: []
    },
    {
      type: 'LineString',
      angle: 0,
      pxLength: 200,
      paths: [
        {
          type: 'LineString',
          angle: 22.5,
          pxLength: 30,
          paths: [
            {
              type: 'LineString',
              angle: 22.5,
              pxLength: 30,
              paths: [
                {
                  type: 'LineString',
                  angle: 22.5,
                  pxLength: 30,
                  paths: [
                    {
                      type: 'LineString',
                      angle: 22.5,
                      pxLength: 30,
                      paths: [
                        {
                          type: 'LineString',
                          angle: 0,
                          pxLength: 200,
                          paths: [
                            {
                              type: 'LineString',
                              angle: 22.5,
                              pxLength: 30,
                              paths: [
                                {
                                  type: 'LineString',
                                  angle: 22.5,
                                  pxLength: 30,
                                  paths: [
                                    {
                                      type: 'LineString',
                                      angle: 22.5,
                                      pxLength: 30,
                                      paths: [
                                        {
                                          type: 'LineString',
                                          angle: 22.5,
                                          pxLength: 1,
                                          paths: [
                                            {
                                              type: 'LineString',
                                              angle: -45,
                                              pxLength: 30,
                                              paths: [
                                              ]
                                            },
                                            {
                                              type: 'LineString',
                                              angle: 45,
                                              pxLength: 30,
                                              paths: [
                                              ]
                                            },
                                            {
                                              type: 'LineString',
                                              angle: 0,
                                              pxLength: 200,
                                              paths: [
                                              ]
                                            },
                                          ]
                                        },
                                      ]
                                    },
                                  ]
                                },
                              ]
                            },
                          ]
                        },
                      ]
                    },
                  ]
                },
              ]
            },
          ]
        },
      ]
    },
    {
      type: 'HandlerPoint',
      rotate: true,
      scale: true,
      angle: 90,
      pxLength: 170,
    }
  ]
};

const retain = null;

const retierement = null;

const screen = {
  paths: [
    {
      type: 'Space',
      angle: -45,
      pxLength: 10,
      paths: [
        {
          type: 'Space',
          angle: 0,
          pxLength: 20,
          text: 'S'
        }
      ]
    },
    {
      type: 'Space',
      angle: -135,
      pxLength: 10,
      paths: [
        {
          type: 'Space',
          angle: 0,
          pxLength: 20,
          text: 'S'
        }
      ]
    },
    {
      type: 'Space',
      angle: 0,
      pxLength: 50,
      paths: [
        {
          type: 'LineString',
          angle: 25,
          pxLength: 100,
          paths: [
            {
              type: 'LineString',
              angle: 90,
              pxLength: 50,
              paths: [
                {
                  type: 'LineString',
                  angle: -90,
                  pxLength: 50,
                  paths: [
                    {
                      type: 'LineString',
                      angle: -135,
                      pxLength: 30,
                    },
                    {
                      type: 'LineString',
                      angle: 135,
                      pxLength: 30,
                    },
                  ]
                },
              ]
            }
          ]
        },
      ]
    },
    {
      type: 'Space',
      angle: -180,
      pxLength: 50,
      paths: [
        {
          type: 'LineString',
          angle: -25,
          pxLength: 100,
          paths: [
            {
              type: 'LineString',
              angle: -90,
              pxLength: 50,
              paths: [
                {
                  type: 'LineString',
                  angle: 90,
                  pxLength: 50,
                  paths: [
                    {
                      type: 'LineString',
                      angle: -135,
                      pxLength: 30,
                    },
                    {
                      type: 'LineString',
                      angle: 135,
                      pxLength: 30,
                    },
                  ]
                },
              ]
            }
          ]
        },
      ]
    },
    {
      type: 'HandlerPoint',
      rotate: true,
      scale: true,
      angle: 90,
      pxLength: 50,
    }
  ]
};

const secure = null;

const seize = null;

const withdraw = {
  paths: [
    {
      type: 'LineString',
      angle: 0,
      pxLength: 50,
      paths: [
        {
          type: 'LineString',
          angle: 22.5,
          pxLength: 30,
          paths: [
            {
              type: 'LineString',
              angle: 22.5,
              pxLength: 30,
              paths: [
                {
                  type: 'LineString',
                  angle: 22.5,
                  pxLength: 30,
                  paths: [
                    {
                      type: 'LineString',
                      angle: 22.5,
                      pxLength: 30,
                      paths: [
                        {
                          type: 'LineString',
                          angle: 0,
                          pxLength: 200,
                          paths: [
                            {
                              type: 'LineString',
                              angle: 22.5,
                              pxLength: 30,
                              paths: [
                                {
                                  type: 'LineString',
                                  angle: 22.5,
                                  pxLength: 30,
                                  paths: [
                                    {
                                      type: 'LineString',
                                      angle: 22.5,
                                      pxLength: 30,
                                      paths: [
                                        {
                                          type: 'LineString',
                                          angle: 22.5,
                                          pxLength: 30,
                                          paths: [
                                            {
                                              type: 'LineString',
                                              angle: 0,
                                              pxLength: 70,
                                              paths: [
                                                {
                                                  type: 'Space',
                                                  angle: 0,
                                                  text: 'W',
                                                  pxLength: 50,
                                                  paths: [
                                                    {
                                                      type: 'LineString',
                                                      angle: 0,
                                                      pxLength: 70,
                                                      paths: [
                                                        {
                                                          type: 'LineString',
                                                          angle: -135,
                                                          pxLength: 30,
                                                          paths: []
                                                        },
                                                        {
                                                          type: 'LineString',
                                                          angle: 135,
                                                          pxLength: 30,
                                                          paths: []
                                                        },
                                                      ]
                                                    },
                                                  ]
                                                },
                                              ]
                                            },
                                          ]
                                        },
                                      ]
                                    },
                                  ]
                                },
                              ]
                            },
                          ]
                        },
                      ]
                    },
                  ]
                },
              ]
            },
          ]
        },
      ]
    },
    {
      type: 'HandlerPoint',
      rotate: true,
      scale: true,
      angle: 90,
      pxLength: 170,
    }
  ]
};

const withdrawUnderPressure = {
  paths: [
    {
      type: 'LineString',
      angle: 0,
      pxLength: 50,
      paths: [
        {
          type: 'LineString',
          angle: 22.5,
          pxLength: 30,
          paths: [
            {
              type: 'LineString',
              angle: 22.5,
              pxLength: 30,
              paths: [
                {
                  type: 'LineString',
                  angle: 22.5,
                  pxLength: 30,
                  paths: [
                    {
                      type: 'LineString',
                      angle: 22.5,
                      pxLength: 30,
                      paths: [
                        {
                          type: 'LineString',
                          angle: 0,
                          pxLength: 200,
                          paths: [
                            {
                              type: 'LineString',
                              angle: 22.5,
                              pxLength: 30,
                              paths: [
                                {
                                  type: 'LineString',
                                  angle: 22.5,
                                  pxLength: 30,
                                  paths: [
                                    {
                                      type: 'LineString',
                                      angle: 22.5,
                                      pxLength: 30,
                                      paths: [
                                        {
                                          type: 'LineString',
                                          angle: 22.5,
                                          pxLength: 30,
                                          paths: [
                                            {
                                              type: 'LineString',
                                              angle: 0,
                                              pxLength: 70,
                                              paths: [
                                                {
                                                  type: 'Space',
                                                  angle: 0,
                                                  text: 'WP',
                                                  pxLength: 50,
                                                  paths: [
                                                    {
                                                      type: 'LineString',
                                                      angle: 0,
                                                      pxLength: 70,
                                                      paths: [
                                                        {
                                                          type: 'LineString',
                                                          angle: -135,
                                                          pxLength: 30,
                                                          paths: []
                                                        },
                                                        {
                                                          type: 'LineString',
                                                          angle: 135,
                                                          pxLength: 30,
                                                          paths: []
                                                        },
                                                      ]
                                                    },
                                                  ]
                                                },
                                              ]
                                            },
                                          ]
                                        },
                                      ]
                                    },
                                  ]
                                },
                              ]
                            },
                          ]
                        },
                      ]
                    },
                  ]
                },
              ]
            },
          ]
        },
      ]
    },
    {
      type: 'HandlerPoint',
      rotate: true,
      scale: true,
      angle: 90,
      pxLength: 170,
    }
  ]
};



const defaultx = {
  paths: [
    {
      type: 'Space',
      angle: 0,
      pxLength: 50,
      paths: [
        {
          type: 'LineString',
          angle: 25,
          pxLength: 100,
          paths: []
        },
      ]
    },
    {
      type: 'HandlerPoint',
      rotate: true,
      scale: true,
      angle: 90,
      pxLength: 50,
    }
  ]
};
