#!/bin/bash
WORKSPACE=..

LUBAN_DLL=$WORKSPACE/tools/Luban/Luban.dll
CONF_ROOT=$WORKSPACE/excels

dotnet $LUBAN_DLL \
    -t all \
    -c typescript-bin \
    -d bin  \
    --conf $CONF_ROOT/luban.conf \
    -x outputCodeDir=$WORKSPACE/assets/script/ExcelGen \
    -x outputDataDir=$WORKSPACE/assets/resources/excel_gen \
    -x pathValidator.rootDir=$WORKSPACE \
    -x l10n.textProviderFile=$WORKSPACE/excels/datas/l10n/texts.json

pause