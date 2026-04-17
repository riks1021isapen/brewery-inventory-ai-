# 発注書 / Purchase Order

- 発注日: {{orderDate}}
- 発注先: {{vendorName}}
- 宛先メール: {{vendorEmail}}

## 明細
{{#each lines}}
- 原料: {{material}} / 数量: {{qty}} {{unit}}
{{/each}}
