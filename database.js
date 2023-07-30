name: Add New Block

on:
  repository_dispatch:
    types: add_block

jobs:
  add_block:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout repository
      uses: actions/checkout@v2

    - name: Display received data
      run: |
        # The block name will be passed as an input to the workflow
        echo "Block Name: ${{ github.event.client_payload.blockName }}"
        
        # Find the template file based on the block name and read its content
        templateFile=$(find . -type f -path "./blocks/${{ github.event.client_payload.blockName }}/templates.js")
        
        # If the template file is found, read its content and store it in a variable
        if [ -f "$templateFile" ]; then
          templateContent=$(cat "$templateFile")
          echo "$templateContent" > templateData.js
          echo "Template content:"
          echo "$templateContent"
        else
          echo "Template file not found: $templateFile"
          exit 1
        fi

    # Add more steps to perform the desired actions with the template data.
