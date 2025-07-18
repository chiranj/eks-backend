script:
  - "sudo apt update"
  - "sudo apt install ca-certificates"
  - "sudo update-ca-certificates"
  # Your existing commands...
  - "dotnet tool install --global dotnet-sonarscanner"

script:
  - "sudo apt update"
  - "sudo apt install gitlab-runner"
  - "apt-get update"
  - "apt-get install --yes --no-install-recommends openjdk-17-jre"
  # Configure NuGet to skip SSL validation
  - "dotnet nuget add source https://api.nuget.org/v3/index.json --name nuget.org --configfile ~/.nuget/NuGet/NuGet.Config"
  - "dotnet nuget update source nuget.org --source https://api.nuget.org/v3/index.json --configfile ~/.nuget/NuGet/NuGet.Config"
  - "export DOTNET_SYSTEM_NET_HTTP_USESOCKETSHTTPHANDLER=0"
  - "dotnet tool install --global dotnet-sonarscanner"
