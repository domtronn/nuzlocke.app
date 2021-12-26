<script>
  import { PIcon } from '$lib/components/core'
</script>

<div class='flex items-center justify-center transform scale-150'>
  <div class='absolute flex items-center justify-center -translate-y-full top-1/2'>
    <div class=spinner>
      <div class=bounce1>
        <PIcon className='absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2' type=item name=poke-ball />
      </div>
      <div class=bounce2>
        <PIcon className='absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2' type=item name=great-ball />
      </div>
      <div class=bounce3>
        <PIcon className='absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2' type=item name=ultra-ball />
      </div>
    </div>
  </div>
</div>

<style>
  .spinner {
    margin: 100px auto 0;
    width: 70px;
    text-align: center;
  }

  .spinner > div {
    width: 18px;
    height: 18px;

    border-radius: 100%;
    display: inline-block;
    -webkit-animation: sk-bouncedelay 1.4s infinite ease-in-out both;
    animation: sk-bouncedelay 1.4s infinite ease-in-out both;
  }

  .spinner .bounce1 { animation-delay: -0.32s; }
  .spinner .bounce2 { animation-delay: -0.16s; }

  @-webkit-keyframes sk-bouncedelay {
    0%, 80%, 100% { -webkit-transform: scale(0) }
    40% { -webkit-transform: scale(1.0) }
  }

  @keyframes sk-bouncedelay {
    0%, 80%, 100% {
      -webkit-transform: scale(0);
      transform: scale(0);
    } 40% {
      -webkit-transform: scale(1.0);
      transform: scale(1.0);
    }
  }
  div { height: calc(100vh - 10rem); }
  div > div { height: auto; }

  :global(.pkitem-great-ball) {
    width: 18px;
    height: 18px;
    background-position: -304px -246px;
  }
  :global(.pkitem-ultra-ball) {
    width: 18px;
    height: 18px;
    background-position: -83px -322px;
  }

</style>
