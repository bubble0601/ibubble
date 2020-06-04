require './helpers/util'

module Lyrics
  extend UtilityHelpers

  module_function
  def async_search
    raise ArgumentError unless block_given?
    begin
      Thread.new { yield }
    rescue => e
      p e
    end
  end

  def search(title, artist = nil)
    search_methods = [
      :search_az,
      :search_jlyric,
    ]
    results = []
    threads = search_methods.map{|s| async_search{ method(s).call(results, title, artist) }}
    threads.each { |t| t.join(10) if t }
    results
  end

  def search_az(results, title, artist)
    q = [title, artist].filter{|e| e}.join(' ')
    url = URI.escape("https://search.azlyrics.com/search.php?q=#{q}")

    doc = get_doc(url)
    links = doc.css('td a:not(.btn)')
    link = nil
    links.each do |l|
      if l['href'] and l['href'].start_with?('https://www.azlyrics.com/lyrics')
        link = l
        break
      end
    end
    return unless link

    doc = get_doc(link['href'])
    body = nil
    divs = doc.css('div.main-page > div > div > div')
    divs.each do |div|
      if div.children.length > 1 and div.children[1].comment? and div.children[1].text.strip.start_with?('Usage')
        body = div
        break
      end
    end
    return unless body

    lyrics = body.children.to_a.filter{|e| e.text?}.map{|e| e.text}.join("\n").strip.gsub("\r", '').gsub("\n\n", "\n")
    results.push({ text: 'azlyrics.com', value: lyrics })
  end

  def search_jlyric(results, title, artist)
    if artist
      url = URI.escape("http://search.j-lyric.net/index.php?kt=#{title}&ct=2&ka=#{artist}&ca=2")
    else
      url = URI.escape("http://search.j-lyric.net/index.php?kt=#{title}&ct=2")
    end

    doc = get_doc(url)
    link = doc.css('div#mnb .bdy .mid a')[0]
    return unless link

    doc = get_doc(link['href'])
    body = doc.css('p#Lyric')[0]
    return unless body

    lyrics = body.children.to_a.filter{|e| e.text?}.map{|e| e.text}.join("\n").strip.gsub("\r", '').gsub("\n\n", "\n")
    results.push({ text: 'j-lyric.net', value: lyrics })
  end
end
