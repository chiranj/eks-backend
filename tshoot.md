RE_Sonar Analysis:
  <<: *release-branch
  stage: preSonar
  image: prod-cicm.uspto.gov:9996/dotnet/sdk:8.0
  variables:
   
    
    GIT_DEPTH: "0"  # Tells git to fetch all the branches of the project, required by the analysis task
    
  script:
    - "sudo apt update"
    - "sudo apt install gitlab-runner"
    - "apt-get update"
    - "apt-get install --yes --no-install-recommends openjdk-17-jre"
    - "dotnet tool install --global dotnet-sonarscanner"
    - "dotnet tool install --global coverlet.console"
    - "export PATH=\"$PATH:$HOME/.dotnet/tools\""
    ....

ERROR
    $ dotnet tool install --global dotnet-sonarscanner
Unhandled exception: NuGet.Protocol.Core.Types.FatalProtocolException: Unable to load the service index for source https://api.nuget.org/v3/index.json.
---> System.Net.Http.HttpRequestException: The SSL connection could not be established, see inner exception.
---> System.Security.Authentication.AuthenticationException: The remote certificate is invalid because of errors in the certificate chain: UntrustedRoot
   at System.Net.Security.SslStream.SendAuthResetSignal(ReadOnlySpan`1 alert, ExceptionDispatchInfo exception)
   at System.Net.Security.SslStream.CompleteHandshake(SslAuthenticationOptions sslAuthenticationOptions)
   at System.Net.Security.SslStream.ForceAuthenticationAsync[TIOAdapter](Boolean receiveFirst, Byte[] reAuthenticationData, CancellationToken cancellationToken)
   at System.Net.Http.ConnectHelper.EstablishSslConnectionAsync(SslClientAuthenticationOptions sslOptions, HttpRequestMessage request, Boolean async, Stream stream, CancellationToken cancellationToken)
   --- End of inner exception stack trace ---
   at System.Net.Http.ConnectHelper.EstablishSslConnectionAsync(SslClientAuthenticationOptions sslOptions, HttpRequestMessage request, Boolean async, Stream stream, CancellationToken cancellationToken)
   at System.Net.Http.HttpConnectionPool.ConnectAsync(HttpRequestMessage request, Boolean async, CancellationToken cancellationToken)
   at System.Net.Http.HttpConnectionPool.CreateHttp11ConnectionAsync(HttpRequestMessage request, Boolean async, CancellationToken cancellationToken)
