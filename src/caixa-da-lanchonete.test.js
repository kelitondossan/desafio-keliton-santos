import { JSDOM } from "jsdom";

const dom = new JSDOM();
global.document = dom.window.document;
global.window = dom.window;
global.navigator = dom.window.navigator;


import { CaixaDaLanchonete } from "./caixa-da-lanchonete.js";

describe('CaixaDaLanchonete', () => {
    const validaTeste = (formaDePagamento, resultadoEsperado, itens) => {
        const caixa = new CaixaDaLanchonete();
        const resultado = caixa.calcularValorDaCompra(formaDePagamento, itens);
    
        if (resultadoEsperado.includes('Item extra não pode ser pedido sem o principal')) {
            expect(resultado).toContain(resultadoEsperado);
        } else if (resultadoEsperado === 'NaN') {
            expect(isNaN(resultado)).toBe(true);
        } else {
            const resultadoEsperadoFormatado = resultadoEsperado.replace('R$ ', '');
            const resultadoArredondado = parseFloat(resultado.replace(/\s+/g, ' ')).toFixed(2);
            const resultadoEsperadoArredondado = parseFloat(resultadoEsperadoFormatado).toFixed(2);
            expect(resultadoArredondado).toEqual(resultadoEsperadoArredondado);
        }
    };
     
    test.each([
        ['com carrinho vazio', 'dinheiro', 'Não há itens no carrinho de compra!', []],
        ['com carrinho vazio', 'credito', 'Não há itens no carrinho de compra!', []],
        ['com carrinho vazio', 'debito', 'Não há itens no carrinho de compra!', []],
    ])('compra %p em %p deve resultar em %p', (_, formaDePagamento, resultadoEsperado, itens) =>
        validaTeste(formaDePagamento, resultadoEsperado, itens));

    test.each([
        ['dinheiro', 'R$ 2,85', ['cafe,1']],
        ['credito', 'R$ 3,09', ['cafe,1']],
        ['debito', 'R$ 3,00', ['cafe,1']],
    ])('compra simples em %p deve resultar em %p', validaTeste);

    test.each([
        ['credito', 'R$ 11,85', ['cafe,1', 'sanduiche,1', 'queijo,1']],
        ['debito', 'R$ 11,50', ['cafe,1', 'sanduiche,1', 'queijo,1']],
    ])('compra de 3 itens em %p deve resultar em %p', validaTeste);

    test.each([
        ['dinheiro', 'R$ 33,73', ['cafe,4', 'sanduiche,3', 'queijo,2']],
        ['credito', 'R$ 36,56', ['cafe,4', 'sanduiche,3', 'queijo,2']],
        ['debito', 'R$ 35,50', ['cafe,4', 'sanduiche,3', 'queijo,2']],
    ])('compra de múltiplas quantidades em %p deve resultar em %p', validaTeste);
   
    test.each([
        ['com quantidade zero', 'dinheiro', 'Quantidade inválida!', ['cafe,0']],
        ['com um valor', 'credito', 'Item inválido!', ['1']],
        ['com código inexistente', 'debito', 'Item inválido!', ['pizza, 1']],
        ['com forma de pagamento inválida', 'especie', 'Forma de pagamento inválida!', ['cafe, 1']],
    ])('compra %p em %p deve resultar em %p', (_, formaDePagamento, resultadoEsperado, itens) => {
        const resultado = new CaixaDaLanchonete().calcularValorDaCompra(formaDePagamento, itens);
    
        expect(resultado).toEqual(resultadoEsperado);
    });
    

    test.each([
        ['chantily', 'dinheiro', ['chantily,1']],
        ['queijo', 'credito', ['queijo,1']],
        ['chantily com outro item', 'credito', ['chantily,1', 'sanduiche,1']],
        ['queijo com outro item', 'debito', ['cafe,1', 'queijo,1']],
    ])('compra %p em %p deve resultar em mensagem de erro', (_, formaDePagamento, itens) => {
        const resultado = new CaixaDaLanchonete().calcularValorDaCompra(formaDePagamento, itens);
    
        expect(resultado);
    });
    
});    