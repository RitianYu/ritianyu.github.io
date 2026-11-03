# Local fonts

Inter: unmodified Latin WOFF2 files from @fontsource/inter 5.2.6. License: OFL.txt.

Hao Name: two minimal, renamed subsets of Noto Serif SC containing only 余 (U+4F59) and 昊 (U+660A). Generated with fontTools from @fontsource/noto-serif-sc to render the author's name on devices without Chinese system fonts. License: OFL-NotoSerifSC.txt.

Hao Brush: `name-brush.woff2` (1.2 KB), a subset of Zhi Mang Xing (志莽行书) from google/fonts containing only 余 and 昊, used for the Chinese name. Generated with fontTools 4.68.0:

```sh
pyftsubset ZhiMangXing-Regular.ttf --text="余昊" --flavor=woff2 --output-file=fonts/name-brush.woff2
```

License: OFL-ZhiMangXing.txt.
