import XLSReportBuilder from "./XLSReportBuilder";
import { OrientacaoVotosResponse, ProposicaoResponse, RowParameters, VotosResponse } from "../api/models/types";

var excelbuilder = require('msexcel-builder');

export default class XlsReportGenerator {

    static idReport: string;
    static xlsBuilder: XLSReportBuilder;

    static async process(proposicoes: ProposicaoResponse[], filePath: String, idReport: String) {
        var location = `${filePath}/${idReport}.xls`;
        const fields: RowParameters[] = await this.fields();

        this.xlsBuilder = new XLSReportBuilder(fields);
        this.xlsBuilder.onStart();

        proposicoes.forEach(proposicao => {
            const votos: VotosResponse[] = proposicao.votacao? proposicao.votacao.votos: [];
            votos.forEach(voto => {
                var values: RowParameters[] = this.getValues(fields, proposicao, voto);
                this.xlsBuilder.onEntry(values);
            })
        });

        this.xlsBuilder.onEnd();
        this.xlsBuilder.close(location);
    }

    static async fields() {
        var fields: RowParameters[] = [
            { value: "ID_PROPOSICAO",                       },
            { value: "SIGLA_TIPO",                          },
            { value: "EMENTA",                              },
            { value: "RESUMO",                              },
            { value: "AUTOR_PROPOSICAO",                    },
            { value: "PARTIDO_DO_AUTOR",                    },
            { value: "TEMA",                                },
            { value: "NATUREZA",                            },
            { value: "SITUAÇÃO",                            },
            { value: "GOVERNO",                             },
            { value: "QUADRIMESTRE",                        },

            { value: "OBJETIVO_DA_VOTACAO"                  },
            { value: "ID_VOTACAO",                          },
            { value: "DATA_VOTACAO",                        },
            { value: "DATA_HORA_REGISTRO_VOTACAO",          },
            { value: "MES_VOTACAO",                         },
            { value: "ANO_VOTACAO",                         },
            { value: "SIGLA_ORGAO_VOTACAO",                 },
            { value: "PROPOSICAO_OBJETO",                   },
            { value: "DECRICAO",                            },
            { value: "APROVACAO",                           },

            { value: "PARLAMENTAR",                         },
            { value: "PARTIDO_PARLAMENTAR",                 },
            { value: "UF_PARLAMENTAR",                      },
            { value: "DATA_VOTO",                           },
            { value: "VOTO",                                },

            { value: "ORIENTACAO_GOVERNO",  color: "#158466"},
            { value: "ADESAO_GOVERNO",      color: "#158466"},
            { value: "ORIENTACAO_PARTIDO",  color: "#2A6099"},
            { value: "ADESAO_PARTIDO",      color: "#2A6099"},
            { value: "ORIENTACAO_MINORIA",  color: "#FF8000"},
            { value: "FAVOR_MINORIA",       color: "#FF8000"},
            { value: "ORIENTACAO_MAIORIA",  color: "#BF0041"},
            { value: "FAVOR_MAIORIA",       color: "#BF0041"},
        ];


        return fields;
    }

    static getValues(columns: RowParameters[], item: ProposicaoResponse, voto: VotosResponse) {
        var values: RowParameters[] = [];
        columns.forEach(column => {
            const value = this.tryToGetValueFor(item, voto, column);
            const v: RowParameters = value == undefined ? { value: "" } : value;
            values.push(v);
        })
        return values;
    }

    static tryToGetValueFor(item: ProposicaoResponse, voto: VotosResponse, column: RowParameters) {
        try {
            return this.provideValueFor(item, voto, column);
        } catch (error) {
            console.log(column, error),
            console.log(item)
            console.log(voto)
            console.log(column)
            return;
        }
    }

    static provideValueFor(item: ProposicaoResponse, voto: VotosResponse, column: RowParameters) {
        switch (column.value) {
            case "ID_PROPOSICAO":                     return { value: item.id                                   };
            case "SIGLA_TIPO":                        return { value: item.siglaTipo                            };
            case "EMENTA":                            return { value: item.ementa                               };
            // case "RESUMO":                            return { value: ""                                        };
            // case "AUTOR_PROPOSICAO":                  return { value: ""                                        };
            // case "PARTIDO_DO_AUTOR":                  return { value: ""                                        };
            case "TEMA":                              return { value: item.tema? item.tema.tema : ""            };
            case "SITUAÇÃO":                          return { value: item.statusProposicao.descricaoSituacao   };
            
            case "OBJETIVO_DA_VOTACAO":               return { value: item.descricaoTipo                        }
            case "ID_VOTACAO":                        return { value: item.votacao.id                           };
            case "DATA_VOTACAO":                      return { value: item.votacao.data                         };
            case "DATA_HORA_REGISTRO_VOTACAO":        return { value: item.votacao.data                         };
            case "MES_VOTACAO":                       return { value: item.votacao.mes                          };
            case "ANO_VOTACAO":                       return { value: item.votacao.ano                          };
            
            case "SIGLA_ORGAO_VOTACAO":               return { value: item.votacao.data                         };
            case "PROPOSICAO_OBJETO":                 return { value: item.votacao.data                         };
            case "DECRICAO":                          return { value: item.votacao.data                         };
            case "APROVACAO":                         return { value: item.votacao.data                                                                                                             };
            
            case "PARLAMENTAR":                       return { value: voto ? voto.deputado_.nome : ""                                                                                               };
            case "PARTIDO_PARLAMENTAR":               return { value: voto ? voto.deputado_.siglaPartido : ""                                                                                       };
            case "UF_PARLAMENTAR":                    return { value: voto ? voto.deputado_.siglaUf : ""                                                                                            };
            case "DATA_VOTO":                         return { value: voto ? voto.dataRegistroVoto : ""                                                                                             };
            
            case "VOTO":                              return { value: voto ? voto.tipoVoto : ""                                                                                                     };
            
            case "ORIENTACAO_PARTIDO":                return { value: voto ? this.votoOrientacao(voto.deputado_.siglaPartido, item.votacao.orientacoes) : "", color: "#B4C7DC"                      };
            case "ADESAO_PARTIDO":                    return { value: voto ? this.votoAFavorOrientacao(voto.tipoVoto, voto.deputado_.siglaPartido, item.votacao.orientacoes) : "", color: "#B4C7DC" };

            case "ORIENTACAO_GOVERNO":                return { value: voto ? this.votoOrientacao("Governo", item.votacao.orientacoes) : "", color: "#B3CAC7"                                        };
            case "ADESAO_GOVERNO":                    return { value: voto ? this.votoAFavorOrientacao(voto.tipoVoto, "Governo", item.votacao.orientacoes) : "", color: "#B3CAC7"                   };

            case "ORIENTACAO_MAIORIA":                return { value: voto ? this.votoOrientacao("Maioria", item.votacao.orientacoes) : "", color: "#FFB66C"                                        };
            case "FAVOR_MAIORIA":                     return { value: voto ? this.votoAFavorOrientacao(voto.tipoVoto, "Maioria", item.votacao.orientacoes) : "", color: "#FFB66C"                   };

            case "ORIENTACAO_MINORIA":                return { value: voto ? this.votoOrientacao("Minoria", item.votacao.orientacoes) : "", color: "#EC9BA4"                                        };
            case "FAVOR_MINORIA":                     return { value: voto ? this.votoAFavorOrientacao(voto.tipoVoto, "Minoria", item.votacao.orientacoes) : "", color: "#EC9BA4"                   };
        }
        return {value: ""}
    }

    static votoAFavorOrientacao(tipoVoto: String, partido: String, orientacoes: OrientacaoVotosResponse[]) {
        var orientacoesFiltros: OrientacaoVotosResponse[] = orientacoes.filter(orientacao => {
            return partido.toLowerCase() === orientacao.siglaPartidoBloco.toLowerCase();
        });

        if (orientacoesFiltros.length == 0)
            return "Não";

        const orientacaoVoto = orientacoesFiltros[0].orientacaoVoto;
        switch (tipoVoto.toLowerCase()) {
            default: return orientacaoVoto.toLowerCase() == tipoVoto.toLowerCase() ? "Sim" : "Não";
        }
    }

    static votoOrientacao(partido: String, orientacoes: OrientacaoVotosResponse[]) {
        var orientacoesFiltros: OrientacaoVotosResponse[] = orientacoes.filter(orientacao => {
            return partido.toLowerCase() === orientacao.siglaPartidoBloco.toLowerCase();
        });

        if (orientacoesFiltros.length == 0)
            return "-";

        return orientacoesFiltros[0].orientacaoVoto;
    }
}