describe('商品選択からカート追加の一連の流れ', () => {
  it('トップページを開き、商品詳細に遷移してカートに追加できる', () => {
    // トップページへアクセス
    cy.visit('/products');

    // 商品リストの1つ目の商品のリンクをクリック
    cy.get('a[href^="/products/xNCq9ak2H3UjP6EkwIqD"]').first().click();

    // URLが商品詳細ページになっていることを確認
    cy.url().should('match', /\/products\/.+/);

    // 「カートに入れる」ボタンがあることを確認しクリック
    cy.contains('button', 'カートに入れる').should('be.visible').click();

    // 「カートに追加しました！」メッセージの表示確認
    cy.contains('カートに追加しました！').should('be.visible');

    // 2秒後にメッセージが消えることを確認
    cy.wait(2100);
    cy.contains('カートに追加しました！').should('not.exist');
  });
});
