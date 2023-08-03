- Dev Container の仕様が変わったのか、Reopen するまで root 権限でコンテナを動かす必要がある模様。
  コンテナに入って $su appuser -> bash を入力すること。

- 誤って root:root のフォルダやファイルを作ってしまった場合、
  　 sudo chown 自分のユーザー:自分のグループ -R ファイル名・フォルダ名
  で変換する。
